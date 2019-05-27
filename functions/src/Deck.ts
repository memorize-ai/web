import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algolia from './Algolia'
import User from './User'

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

	static updateCount(id: string, increment: boolean): Promise<FirebaseFirestore.WriteResult> {
		return new Deck(id).updateCount(increment)
	}

	static updateViews(id: string, { total, unique }: { total: number, unique: number }): Promise<FirebaseFirestore.WriteResult> {
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

	static updateDownloads(id: string, { total, current }: { total: number, current: number }): Promise<FirebaseFirestore.WriteResult> {
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

	static updateRating(id: string, { from, to }: { from: number | undefined, to: number }): Promise<FirebaseFirestore.WriteResult> {
		const doc = Deck.doc(id)
		return doc.get().then(deck => {
			const rating = deck.get('rating')
			if (from) rating[from]--
			if (to) rating[to]++
			rating.average = Deck.averageRating(rating)
			return doc.update({ rating })
		})
	}

	static updateUserRating(id: string, { uid, rating, review, date }: { uid: string, rating: number, review: string, date: Date }): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/ratings/${id}`)
		return rating
			? doc.set({ rating, review, date })
			: doc.collection('cards').get().then(cards => {
				const deleteField = admin.firestore.FieldValue.delete()
				return cards.empty ? doc.delete() : doc.set({ rating: deleteField, review: deleteField, date: deleteField })
			})
	}

	static updateLastUpdated(id: string): Promise<FirebaseFirestore.WriteResult> {
		return Deck.doc(id).update({ updated: new Date() })
	}

	updateCount(increment: boolean): Promise<FirebaseFirestore.WriteResult> {
		return Deck.doc(this.id).update({ count: admin.firestore.FieldValue.increment(increment ? 1 : -1) })
	}
}

export const deckCreated = functions.firestore.document('decks/{deckId}').onCreate((snapshot, context) =>
	Promise.all([
		Algolia.createDeck(snapshot, context),
		User.updateLastActivity(context.auth!.uid)
	])
)

export const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate((change, context) =>
	change.before.get('updated') === change.after.get('updated')
		? Promise.all([
			Algolia.updateDeck(change, context),
			Deck.updateLastUpdated(context.params.deckId),
			User.updateLastActivity(context.auth!.uid)
		])
		: Promise.resolve()
)

export const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete((snapshot, context) =>
	Promise.all([
		Algolia.deleteDeck(snapshot),
		User.updateLastActivity(context.auth!.uid)
	])
)

export const viewDeck = functions.https.onCall((data, context) => {
	const uid = context.auth!.uid
	return Deck.user(uid, data.deckId).then(user =>
		Promise.all([
			Deck.updateViews(data.deckId, { total: 1, unique: user ? 0 : 1 }),
			user ? Promise.resolve() : Deck.doc(data.deckId, `users/${uid}`).set({ past: false, current: false }),
			User.updateLastActivity(uid)
		])
	)
})

export const rateDeck = functions.https.onCall((data, context) => {
	const date = new Date()
	const uid = context.auth!.uid
	const rating = data.rating
	const review = rating && data.review ? data.review : ''
	const setField = (value: any) => rating ? value : admin.firestore.FieldValue.delete()
	return firestore.doc(`users/${uid}/ratings/${data.deckId}`).get().then(oldRating =>
		Promise.all([
			Deck.updateUserRating(data.deckId, { uid, rating, review, date }),
			Deck.doc(data.deckId, `users/${uid}`).update({
				rating: setField(rating),
				review: setField(review),
				date: setField(date)
			}),
			Deck.updateRating(data.deckId, { from: oldRating.get('rating'), to: rating }),
			User.updateLastActivity(uid)
		])
	)
})