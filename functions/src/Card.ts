import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from './Deck'

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

	static updateUserRating({ deckId, cardId }: { deckId: string, cardId: string }, { uid, rating }: { uid: string, rating: CardRating }): Promise<any[]> {
		const value = rating.valueOf()
		const set = (doc: FirebaseFirestore.DocumentReference) => value ? doc.set({ rating: value }) : doc.delete()
		return Promise.all([
			set(firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`)),
			set(Deck.doc(deckId, `users/${uid}/cards/${cardId}`))
		])
	}
}

export const rateCard = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	const cardId = data.cardId
	const id = { deckId, cardId }
	const uid = context.auth!.uid
	const rating = data.rating
	return firestore.doc(`users/${uid}/ratings/${deckId}/cards/${cardId}`).get().then(oldRating =>
		Promise.all([
			Card.updateUserRating(id, { uid, rating }),
			Card.updateRating(id, { from: oldRating.get('rating'), to: rating })
		])
	)
})

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, true)
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, false)
)