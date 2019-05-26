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
	static updateRating({ deckId, cardId }: { deckId: string, cardId: string }, { from, to }: { from: CardRating | undefined, to: CardRating }): Promise<any> {
		const promises: Promise<any>[] = []
		const update = (obj: any) => promises.push(Deck.doc(deckId, `cards/${cardId}`).update(obj))
		const decrement = admin.firestore.FieldValue.increment(-1)
		const increment = admin.firestore.FieldValue.increment(1)
		switch (from) {
		case CardRating.like:
			update({ likes: decrement })
		case CardRating.dislike:
			update({ dislikes: decrement })
		}
		switch (to) {
		case CardRating.like:
			update({ likes: increment })
		case CardRating.dislike:
			update({ dislikes: increment })
		}
		return Promise.all(promises)
	}

	static updateUserRating({ deckId, cardId }: { deckId: string, cardId: string }, { uid, rating, date }: { uid: string, rating: CardRating, date: Date }): Promise<any[]> {
		const value = rating.valueOf()
		const set = (doc: FirebaseFirestore.DocumentReference) => value ? doc.set({ rating: value, date }) : doc.delete()
		return Promise.all([
			set(firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`)),
			set(Deck.doc(deckId, `users/${uid}/cards/${cardId}`))
		])
	}

	static updateLastUpdated({ deckId, cardId }: { deckId: string, cardId: string }): Promise<any> {
		const updated = new Date()
		return Promise.all([
			Deck.doc(deckId, `cards/${cardId}`).update({ updated }),
			Deck.doc(deckId).update({ updated })
		])
	}
}

export const rateCard = functions.https.onCall((data, context) => {
	const date = new Date()
	const deckId = data.deckId
	const cardId = data.cardId
	const id = { deckId, cardId }
	const uid = context.auth!.uid
	const rating = data.rating
	return firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`).get().then(oldRating =>
		Promise.all([
			Card.updateUserRating(id, { uid, rating, date }),
			Card.updateRating(id, { from: oldRating.get('rating'), to: rating }),
			User.updateLastActivity(uid)
		])
	)
})

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Promise.all([
		Deck.updateCount(context.params.deckId, true),
		User.updateLastActivity(context.auth!.uid)
	])
)

export const cardUpdated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onUpdate((_change, context) =>
	Promise.all([
		Card.updateLastUpdated({ deckId: context.params.deckId, cardId: context.params.cardId }),
		User.updateLastActivity(context.auth!.uid)
	])
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Promise.all([
		Deck.updateCount(context.params.deckId, false),
		User.updateLastActivity(context.auth!.uid)
	])
)