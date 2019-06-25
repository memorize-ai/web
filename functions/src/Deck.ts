import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algolia from './Algolia'
import User from './User'
import Permission, { PermissionRole, PermissionStatus } from './Permission'

const firestore = admin.firestore()
const storage = admin.storage().bucket('us')

export default class Deck {
	static doc(id: string, path?: string): FirebaseFirestore.DocumentReference {
		return firestore.doc(`decks/${id}${path ? `/${path}` : ''}`)
	}

	static collection(id: string, path: string): FirebaseFirestore.CollectionReference {
		return Deck.doc(id).collection(path)
	}

	static user(uid: string, deckId: string): Promise<{ past: boolean, current: boolean, rating: number } | null> {
		return Deck.doc(deckId, `users/${uid}`).get().then(user =>
			user.exists ? { past: user.get('past'), current: user.get('current'), rating: user.get('rating') } : null
		)
	}

	static updateCount(id: string, increment: boolean): Promise<FirebaseFirestore.WriteResult> {
		return Deck.doc(id).update({ count: admin.firestore.FieldValue.increment(increment ? 1 : -1) })
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

	private static averageRating(ratings: any): number {
		let weighted = 0
		let total = 0
		for (let i = 1; i <= 5; i++) {
			const amount = ratings[i]
			weighted += amount * i
			total += amount
		}
		return total ? weighted / total : 0
	}

	static updateRating(id: string, { from, to }: { from: number | undefined, to: number }): Promise<FirebaseFirestore.WriteResult> {
		const doc = Deck.doc(id)
		return doc.get().then(deck => {
			const ratings = deck.get('ratings')
			if (from) ratings[from]--
			if (to) ratings[to]++
			ratings.average = Deck.averageRating(ratings)
			return doc.update({ ratings })
		})
	}

	static updateUserRating(id: string, { uid, rating, title, review, date }: { uid: string, rating: number, title: string, review: string, date: Date }): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/ratings/${id}`)
		return rating
			? doc.set({ rating, title, review, date })
			: doc.collection('cards').get().then(cards =>
				cards.empty ? doc.delete() : doc.set({ x: '' })
			)
	}

	static updateLastUpdated(id: string): Promise<FirebaseFirestore.WriteResult> {
		return Deck.doc(id).update({ updated: new Date })
	}

	static image(id: string): Promise<string> {
		return storage.file(`decks/${id}`).getSignedUrl({ action: 'read', expires: '03-09-2491' }).then(signedUrls => signedUrls[0])
	}

	static url(id: string): string {
		return `https://memorize.ai/decks/${id}`
	}

	static export(id: string): Promise<string> {
		const json: any = {}
		return Deck.doc(id).get().then(deck => {
			if (!deck.exists) return Promise.resolve()
			json[id] = deck.data()
			return Deck.collection(id, 'cards').get().then(cards =>
				cards.forEach(card =>
					json[id].cards[card.id] = card.data()
				)
			)
		}).then(() => JSON.stringify(json))
	}
}

export const deckCreated = functions.firestore.document('decks/{deckId}').onCreate((snapshot, context) =>
	Promise.all([
		firestore.doc(`users/${snapshot.get('creator')}`).get().then(creator => {
			const creatorName = creator.get('name')
			return Algolia.create({
				index: Algolia.indices.decks,
				snapshot,
				excess: { creatorName, ownerName: creatorName }
			})
		}),
		context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve() as Promise<any>
	])
)

export const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate((change, context) =>
	change.before.get('updated').isEqual(change.after.get('updated'))
		? Promise.all([
			firestore.doc(`users/${change.after.get('creator')}`).get().then(creator =>
				firestore.doc(`users/${change.after.get('owner')}`).get().then(owner =>
					Algolia.update({
						index: Algolia.indices.decks,
						change,
						excess: { creatorName: creator.get('name'), ownerName: owner.get('name') }
					})
				)
			),
			Deck.updateLastUpdated(context.params.deckId),
			context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve() as Promise<any>
		])
		: Promise.resolve()
)

export const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete((_snapshot, context) =>
	Promise.all([
		Algolia.delete({ index: Algolia.indices.decks, id: context.params.deckId }),
		storage.file(`decks/${context.params.deckId}`).delete(),
		context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve() as Promise<any>
	])
)

export const viewDeck = functions.https.onCall((data, context) => {
	if (!context.auth) return Deck.updateViews(data.deckId, { total: 1, unique: 0 })
	const uid = context.auth.uid
	return Deck.user(uid, data.deckId).then(user =>
		Promise.all([
			Deck.updateViews(data.deckId, { total: 1, unique: user ? 0 : 1 }),
			user ? Promise.resolve() as Promise<any> : Deck.doc(data.deckId, `users/${uid}`).set({ past: false, current: false }),
			User.updateLastActivity(uid)
		])
	)
})

export const rateDeck = functions.https.onCall((data, context) => {
	if (!context.auth) return new functions.https.HttpsError('permission-denied', 'You must be signed in')
	const date = new Date
	const uid = context.auth.uid
	const rating = data.rating
	const title = rating && data.title ? data.title : ''
	const review = rating && data.review ? data.review : ''
	const setField = (value: any) =>
		rating ? value : admin.firestore.FieldValue.delete()
	return firestore.doc(`users/${uid}/ratings/${data.deckId}`).get().then(oldRating =>
		Promise.all([
			Deck.updateUserRating(data.deckId, { uid, rating, title, review, date }),
			Deck.doc(data.deckId, `users/${uid}`).update({
				hasTitle: setField(title.length !== 0),
				rating: setField(rating),
				title: setField(title),
				review: setField(review),
				date: setField(date)
			}),
			Deck.updateRating(data.deckId, { from: oldRating.get('rating'), to: rating }),
			User.updateLastActivity(uid)
		])
	)
})

export const addDeck = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	if (context.auth && deckId) {
		const uid = context.auth.uid
		const addDeckWithRole = (role: PermissionRole) => User.addDeck(uid, deckId, role)
		return Deck.doc(deckId).get().then(deck =>
			deck.exists
				? deck.get('owner') === uid
					? addDeckWithRole(PermissionRole.owner)
					: Permission.get(uid, deckId).then(permission =>
						addDeckWithRole(permission.status === PermissionStatus.accepted ? permission.role : PermissionRole.none)
					)
				: new functions.https.HttpsError('not-found', 'Deck does not exist') as any
		)
	} else
		return new functions.https.HttpsError('permission-denied', 'You must be signed in and pass in a deckId')
})

export const clearDeckData = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	if (context.auth && deckId) {
		const doc = firestore.doc(`users/${context.auth.uid}/decks/${deckId}`)
		return Promise.all([
			doc.update({ mastered: 0 }),
			doc.collection('cards').listDocuments().then(cards =>
				Promise.all(cards.map(card =>
					Promise.all([
						doc.collection(`cards/${card.id}/history`).listDocuments().then(histories =>
							Promise.all(histories.map(history =>
								history.delete()
							))
						),
						card.delete()
					])
				))
			)
		])
	} else
		return new functions.https.HttpsError('permission-denied', 'You must be signed in and pass in a deckId')
})