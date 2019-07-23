import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { getDate } from './Helpers'
import Deck from './Deck'
import User from './User'
import Reputation, { ReputationAction } from './Reputation'

const firestore = admin.firestore()

export default class Card {
	static rating(num: number): CardRating {
		switch (num) {
		case 1:
			return CardRating.like
		case -1:
			return CardRating.dislike
		default:
			return CardRating.none
		}
	}

	static updateRating({ deckId, cardId }: { deckId: string, cardId: string }, { from, to }: { from: CardRating | undefined, to: CardRating }): Promise<FirebaseFirestore.WriteResult[]> {
		const promises: Promise<FirebaseFirestore.WriteResult>[] = []
		const update = (obj: any) =>
			promises.push(Deck.doc(deckId, `cards/${cardId}`).update(obj))
		const decrement = admin.firestore.FieldValue.increment(-1)
		const increment = admin.firestore.FieldValue.increment(1)
		switch (from) {
		case CardRating.like:
			update({ likes: decrement })
			break
		case CardRating.dislike:
			update({ dislikes: decrement })
			break
		}
		switch (to) {
		case CardRating.like:
			update({ likes: increment })
			break
		case CardRating.dislike:
			update({ dislikes: increment })
			break
		}
		return Promise.all(promises)
	}

	static updateUserRating({ deckId, cardId }: { deckId: string, cardId: string }, { uid, rating, date }: { uid: string, rating: CardRating, date: Date }): Promise<FirebaseFirestore.WriteResult[]> {
		const ratingValue = rating.valueOf()
		const set = (doc: FirebaseFirestore.DocumentReference) =>
			rating === CardRating.none ? doc.delete() : doc.set({ rating: ratingValue, date, dateMilliseconds: date.getTime() })
		const deckRating = firestore.doc(`users/${uid}/ratings/${deckId}`)
		return Promise.all([
			set(firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`)),
			set(Deck.doc(deckId, `users/${uid}/cards/${cardId}`)),
			deckRating.get().then(deckRatingSnapshot =>
				deckRatingSnapshot.exists
					? Promise.resolve() as Promise<any>
					: deckRating.set({ x: '' })
			)
		])
	}

	static updateLastUpdated({ deckId, cardId }: { deckId: string, cardId: string }): Promise<FirebaseFirestore.WriteResult[]> {
		const updated = new Date
		return Promise.all([
			Deck.doc(deckId, `cards/${cardId}`).update({ updated }),
			Deck.doc(deckId).update({ updated })
		])
	}

	static isDue(card: FirebaseFirestore.DocumentSnapshot, date: number = Date.now()): boolean {
		return card.exists
			? date <= (getDate(card, 'next') || new Date).getTime()
			: true
	}

	static data(front: string, back: string, date: Date = new Date): CardData {
		return {
			front,
			back,
			created: date,
			updated: date,
			likes: 0,
			dislikes: 0
		}
	}
}

export enum CardRating {
	like = 1,
	none = 0,
	dislike = -1
}

export type CardLast = { id: string, date: FirebaseFirestore.Timestamp, rating: number, elapsed: number }
export type CardData = { front: string, back: string, created: Date, updated: Date, likes: number, dislikes: number }

export const rateCard = functions.https.onCall((data, context) => {
	if (!context.auth) return new functions.https.HttpsError('unauthenticated', 'You must be signed in')
	const date = new Date
	const deckId: string | undefined = data.deckId
	const cardId: string | undefined = data.cardId
	if (!(deckId && cardId)) return new functions.https.HttpsError('invalid-argument', 'deckId and cardId required')
	const id = { deckId, cardId }
	const uid = context.auth.uid
	const rating = Card.rating(data.rating)
	return firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`).get().then(oldRating => {
		const oldRatingAsCardRating = Card.rating(oldRating.get('rating') || 0)
		return Promise.all([
			Card.updateUserRating(id, { uid, rating, date }),
			Card.updateRating(id, { from: oldRatingAsCardRating, to: rating }),
			User.updateLastActivity(uid),
			Deck.doc(deckId).get().then(deck =>
				firestore.doc(`users/${uid}`).get().then(user => {
					const ownerId: string = deck.get('owner') || ''
					const name: string = user.get('name') || ''
					const deckName: string = deck.get('name') || ''
					if (oldRatingAsCardRating === CardRating.none)
						return Reputation.push(
							ownerId,
							rating === CardRating.like ? ReputationAction.didGetCardLike : ReputationAction.didGetCardDislike,
							`${name} ${rating === CardRating.like ? 'liked' : 'disliked'} a card in ${deckName}`,
							{ uid }
						)
					else if (rating === CardRating.none)
						return Reputation.push(
							ownerId,
							oldRatingAsCardRating === CardRating.like ? ReputationAction.didGetCardLikeRemoved : ReputationAction.didGetCardDislikeRemoved,
							`${name} removed their ${oldRatingAsCardRating === CardRating.like ? '' : 'dis'}like on a card in ${deckName}`,
							{ uid }
						)
					else
						return Reputation.getAmountForAction(rating === CardRating.like ? ReputationAction.didGetCardLike : ReputationAction.didGetCardDislike).then(firstAmount =>
							Reputation.getAmountForAction(oldRatingAsCardRating === CardRating.like ? ReputationAction.didGetCardLikeRemoved : ReputationAction.didGetCardDislikeRemoved).then(secondAmount =>
								Reputation.pushWithAmount(
									ownerId,
									firstAmount + secondAmount,
									`${name} changed their ${oldRatingAsCardRating === CardRating.like ? '' : 'dis'}like to a ${rating === CardRating.like ? '' : 'dis'}like on a card in ${deckName}`,
									{ uid }
								)
							)
						)
				})
			)
		])
	})
})

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, true)
)

export const cardUpdated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onUpdate((change, context) =>
	(change.before.get('updated') as FirebaseFirestore.Timestamp).isEqual(change.after.get('updated') as FirebaseFirestore.Timestamp) && change.before.get('likes') === change.after.get('likes') && change.before.get('dislikes') === change.after.get('dislikes')
		? Card.updateLastUpdated({ deckId: context.params.deckId, cardId: context.params.cardId })
		: Promise.resolve()
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, false)
)