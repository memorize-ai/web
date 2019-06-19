import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from './Deck'
import User from './User'

const firestore = admin.firestore()

export enum CardRating {
	like = 1,
	none = 0,
	dislike = -1
}

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
		const update = (obj: any) => promises.push(Deck.doc(deckId, `cards/${cardId}`).update(obj))
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
			rating === CardRating.none ? doc.delete() : doc.set({ rating: ratingValue, date })
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
}

export const rateCard = functions.https.onCall((data, context) => {
	if (!context.auth) return new functions.https.HttpsError('permission-denied', 'You must be signed in')
	const date = new Date
	const deckId = data.deckId
	const cardId = data.cardId
	const id = { deckId, cardId }
	const uid = context.auth.uid
	const rating = Card.rating(data.rating)
	return firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`).get().then(oldRating =>
		Promise.all([
			Card.updateUserRating(id, { uid, rating, date }),
			Card.updateRating(id, { from: Card.rating(oldRating.get('rating') || 0), to: rating }),
			User.updateLastActivity(uid)
		])
	)
})

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, true)
)

export const cardUpdated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onUpdate((change, context) =>
	change.before.get('updated') === change.after.get('updated')
		? Card.updateLastUpdated({ deckId: context.params.deckId, cardId: context.params.cardId })
		: Promise.resolve()
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, false)
)