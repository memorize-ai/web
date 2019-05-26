import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algolia from './Algolia'

const firestore = admin.firestore()

export default class Deck {
	id: string

	constructor(id: string) {
		this.id = id
	}

	static doc(id: string, path?: string): FirebaseFirestore.DocumentReference {
		return firestore.doc(`decks/${id}${path ? `/${path}` : ''}`)
	}

	static user(uid: string, deckId: string): Promise<{ past: boolean, current: boolean, rating: number } | null> {
		return Deck.doc(deckId, `users/${uid}`).get().then(user =>
			user.exists ? { past: user.get('past'), current: user.get('current'), rating: user.get('rating') } : null
		)
	}

	static updateCount(id: string, increment: boolean): Promise<any> {
		return new Deck(id).updateCount(increment)
	}

	static updateViews(id: string, { total, unique }: { total: number, unique: number }): Promise<any> {
		const doc = Deck.doc(id)
		return doc.get().then(deck => {
			const views = deck.get('views')
			return doc.update({
				views: {
					total: views.total + total,
					unique: views.unique + unique
				}
			})
		})
	}

	static updateDownloads(id: string, { total, current }: { total: number, current: number }): Promise<any> {
		const doc = Deck.doc(id)
		return doc.get().then(deck => {
			const downloads = deck.get('downloads')
			return doc.update({
				downloads: {
					total: downloads.total + total,
					current: downloads.current + current
				}
			})
		})
	}

	private static averageRating(rating: any): number {
		let sum = 0
		for (let i = 1; i <= 5; i++)
			sum += rating[i] * i
		return sum / 5
	}

	static updateRating(id: string, { from, to }: { from: number | undefined, to: number }): Promise<any> {
		const doc = Deck.doc(id)
		return doc.get().then(deck => {
			const rating = deck.get('rating')
			if (from) rating[from]--
			rating[to]++
			rating.average = Deck.averageRating(rating)
			return doc.update({ rating })
		})
	}

	updateCount(increment: boolean): Promise<any> {
		return Deck.doc(this.id).update({ count: admin.firestore.FieldValue.increment(increment ? 1 : -1) })
	}
}

export const deckCreated = functions.firestore.document('decks/{deckId}').onCreate(Algolia.createDeck)
export const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(Algolia.updateDeck)
export const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(Algolia.deleteDeck)

export const viewDeck = functions.https.onCall((data, context) =>
	Deck.user(context.auth!.uid, data.deckId).then(user =>
		Promise.all([
			Deck.updateViews(data.deckId, { total: 1, unique: user ? 0 : 1 })
		].concat(user
			? []
			: Deck.doc(data.deckId, `users/${context.auth!.uid}`).set({
				past: false,
				current: false,
				rating: 0
			})
		))
	)
)

export const rateDeck = functions.https.onCall((data, context) => {
	const rating = data.rating
	const ratingData = { rating, review: data.review }
	const ratingDoc = firestore.doc(`users/${context.auth!.uid}/ratings/${data.deckId}`)
	return ratingDoc.get().then(oldRating =>
		Promise.all([
			ratingDoc.set(ratingData),
			Deck.doc(data.deckId, `users/${context.auth!.uid}`).update(ratingData),
			Deck.updateRating(data.deckId, { from: oldRating.get('rating'), to: rating })
		])
	)
})