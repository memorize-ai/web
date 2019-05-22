import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algolia from './Algolia'

const firestore = admin.firestore()

export enum DeckRating {
	like = 1,
	none = 0,
	dislike = -1
}

export default class Deck {
	id: string

	constructor(id: string) {
		this.id = id
	}

	static rating(rating: number): DeckRating {
		switch (rating) {
		case 1:
			return DeckRating.like
		case -1:
			return DeckRating.dislike
		default:
			return DeckRating.none
		}
	}

	static valueOf(rating: DeckRating): number {
		return rating.valueOf()
	}

	static user(uid: string, deckId: string): Promise<{ past: boolean, current: boolean, rating: DeckRating } | null> {
		return firestore.doc(`decks/${deckId}/users/${uid}`).get().then(user =>
			user.exists ? { past: user.get('past'), current: user.get('current'), rating: Deck.rating(user.get('rating')) } : null
		)
	}

	static updateCount(id: string, increment: boolean): Promise<any> {
		return new Deck(id).updateCount(increment)
	}

	updateCount(increment: boolean): Promise<any> {
		return firestore.doc(`decks/${this.id}`).update({ count: admin.firestore.FieldValue.increment(increment ? 1 : -1) })
	}
}

export const deckCreated = functions.firestore.document('decks/{deckId}').onCreate(Algolia.createDeck)
export const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(Algolia.updateDeck)
export const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(Algolia.deleteDeck)

export const viewDeck = functions.https.onCall((data, _context) =>
	Deck.user(data.uid, data.deckId).then(user =>
		Promise.all([
			firestore.doc(`decks/${data.deckId}`).update({ views: {
				total: admin.firestore.FieldValue.increment(1),
				unique: admin.firestore.FieldValue.increment(user ? 0 : 1)
			} })
		].concat(user
			? []
			: firestore.doc(`decks/${data.deckId}/users/${data.uid}`).set({
				past: false,
				current: false,
				rating: 0
			})
		))
	)
)

export const rateDeck = functions.https.onCall((data, _context) => {
	const rating = data.newRating
	return Promise.all([
		firestore.doc(`users/${data.uid}/ratings/${data.deckId}`).set({ rating }),
		firestore.doc(`decks/${data.deckId}/users/${data.uid}`).update({ rating }),
		updateRating(data.deckId, Deck.rating(data.oldRating), Deck.rating(rating))
	])
})

function updateRating(deckId: string, oldRating: DeckRating, newRating: DeckRating): Promise<any> {
	const promises: Promise<any>[] = []
	const decrement = admin.firestore.FieldValue.increment(-1)
	switch (oldRating) {
	case DeckRating.like:
		promises.push(firestore.doc(`decks/${deckId}`).update({ likes: decrement }))
	case DeckRating.dislike:
		promises.push(firestore.doc(`decks/${deckId}`).update({ dislikes: decrement }))
	}
	const increment = admin.firestore.FieldValue.increment(1)
	switch (newRating) {
	case DeckRating.like:
		promises.push(firestore.doc(`decks/${deckId}`).update({ likes: increment }))
	case DeckRating.dislike:
		promises.push(firestore.doc(`decks/${deckId}`).update({ dislikes: increment }))
	}
	return Promise.all(promises)
}