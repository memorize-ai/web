import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algolia from './Algolia'
import User from './User'
import Permission, { PermissionRole, PermissionStatus } from './Permission'
import Reputation, { ReputationAction } from './Reputation'

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
			? doc.set({ rating, title, review, date, dateMilliseconds: date.getTime() })
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
		return `https://memorize.ai/d/${id}`
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

export const deckCreated = functions.firestore.document('decks/{deckId}').onCreate((snapshot, context) => {
	const uid = snapshot.get('creator')
	return Promise.all([
		firestore.doc(`users/${uid}`).get().then(creator => {
			const creatorName = creator.get('name')
			return Algolia.create({
				index: Algolia.indices.decks,
				snapshot,
				excess: { creatorName, ownerName: creatorName }
			})
		}),
		User.updateLastActivity(uid),
		Reputation.push(uid, ReputationAction.createDeck, `You created ${snapshot.get('name')}`, { deckId: context.params.deckId })
	])
})

export const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate((change, context) =>
	change.before.get('updated').isEqual(change.after.get('updated')) && change.before.get('views') === change.after.get('views') && change.before.get('downloads') === change.after.get('downloads') && change.before.get('ratings') === change.after.get('ratings')
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

export const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete((snapshot, context) =>
	Promise.all([
		Algolia.delete({ index: Algolia.indices.decks, id: snapshot.id }),
		storage.file(`decks/${context.params.deckId}`).delete(),
		snapshot.ref.collection('users').where('past', '==', true).get().then(users =>
			Promise.all(users.docs.map(user =>
				firestore.doc(`users/${user.id}/decks/${snapshot.id}`).delete()
			))
		),
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
	if (!context.auth) return new functions.https.HttpsError('unauthenticated', 'You must be signed in')
	const date = new Date
	const uid = context.auth.uid
	const rating = data.rating
	const title = rating && data.title ? data.title : ''
	const review = rating && data.review ? data.review : ''
	const deckId = data.deckId
	const setField = (value: any) =>
		rating ? value : admin.firestore.FieldValue.delete()
	return firestore.doc(`users/${uid}/ratings/${deckId}`).get().then(oldRating => {
		const oldRatingNumber = oldRating.get('rating')
		return Promise.all([
			Deck.updateUserRating(deckId, { uid, rating, title, review, date }),
			Deck.doc(deckId, `users/${uid}`).update({
				hasTitle: setField(title.length !== 0),
				rating: setField(rating),
				title: setField(title),
				review: setField(review),
				date: setField(date),
				dateMilliseconds: setField(date.getTime())
			}),
			Deck.updateRating(deckId, { from: oldRatingNumber, to: rating }),
			User.updateLastActivity(uid),
			Deck.doc(deckId).get().then(deck => {
				const didReview = review.length !== 0
				const deckName = deck.get('name')
				const ownerId = deck.get('owner')
				return firestore.doc(`users/${uid}`).get().then(user => {
					const name = user.get('name')
					if (oldRatingNumber === 0) {
						const newRatingAsReputationAction = getReputationActionDeckRatingFromNumber(rating)
						if (!newRatingAsReputationAction) return Promise.resolve() as Promise<any>
						return Promise.all([
							Reputation.push(
								uid,
								didReview ? ReputationAction.rateDeckWithReview : ReputationAction.rateDeck,
								`You gave ${deckName} a ${rating} star r${didReview ? 'eview' : 'ating'}`,
								{ deckId }
							),
							Reputation.push(
								ownerId,
								newRatingAsReputationAction,
								`${name} gave ${deckName} a ${rating} star r${didReview ? 'eview' : 'ating'}`,
								{ uid }
							)
						])
					} else if (rating === 0) {
						const oldRatingAsReputationAction = getReputationActionDeckRatingRemovedFromNumber(rating)
						if (!oldRatingAsReputationAction) return Promise.resolve() as Promise<any>
						const didRemoveReview = oldRating.get('review').length !== 0
						return Promise.all([
							Reputation.push(
								uid,
								didRemoveReview ? ReputationAction.unrateDeckWithReview : ReputationAction.unrateDeck,
								`You removed your ${oldRatingNumber} star r${didRemoveReview ? 'eview' : 'ating'} for ${deckName}`,
								{ deckId }
							),
							Reputation.push(
								ownerId,
								oldRatingAsReputationAction,
								`${name} removed their ${oldRatingNumber} star r${didRemoveReview ? 'eview' : 'ating'} for ${deckName}`,
								{ uid }
							)
						])
					} else {
						const oldRatingAsReputationAction = getReputationActionDeckRatingRemovedFromNumber(rating)
						const newRatingAsReputationAction = getReputationActionDeckRatingFromNumber(rating)
						if (!(oldRatingAsReputationAction && newRatingAsReputationAction)) return Promise.resolve() as Promise<any>
						const didHaveReview = oldRating.get('review').length !== 0
						const didRemoveReview = didHaveReview && !didReview
						const didAddReview = !didHaveReview && didReview
						return Promise.all([
							Reputation.getAmountForAction(didRemoveReview ? ReputationAction.unrateDeckWithReview : ReputationAction.unrateDeck).then(firstAmount =>
								Reputation.getAmountForAction(didRemoveReview ? ReputationAction.rateDeck : (didAddReview ? ReputationAction.rateDeckWithReview : ReputationAction.rateDeck)).then(secondAmount => {
									const total = firstAmount + secondAmount
									return total
										? Reputation.pushWithAmount(
											uid,
											total,
											`You changed your ${oldRatingNumber} star r${didHaveReview ? 'eview' : 'ating'} to a ${rating} star r${didReview ? 'eview' : 'ating'} for ${deckName}`,
											{ deckId }
										)
										: Promise.resolve() as Promise<any>
								})
							),
							Reputation.getAmountForAction(oldRatingAsReputationAction).then(firstAmount =>
								Reputation.getAmountForAction(newRatingAsReputationAction).then(secondAmount => {
									const total = firstAmount + secondAmount
									return total
										? Reputation.pushWithAmount(
											ownerId,
											total,
											`${name} changed their ${oldRatingNumber} star r${didHaveReview ? 'eview' : 'ating'} to a ${rating} star r${didReview ? 'eview' : 'ating'} for ${deckName}`,
											{ uid }
										)
										: Promise.resolve() as Promise<any>
								})
							)
						])
					}
				})
			})
		])
	})
})

export const addDeck = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	if (context.auth && deckId) {
		const uid = context.auth.uid
		const addDeckWithRole = (role: PermissionRole) =>
			User.addDeck(uid, deckId, role)
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
		return new functions.https.HttpsError('unauthenticated', 'You must be signed in and pass in a deckId')
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
		return new functions.https.HttpsError('unauthenticated', 'You must be signed in and pass in a deckId')
})

export const deleteDeck = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	if (context.auth && deckId) {
		const uid = context.auth.uid
		const deckRef = Deck.doc(deckId)
		return deckRef.get().then(deck =>
			deck.get('owner') === uid
				? Promise.all([
					deckRef.delete(),
					deckRef.collection('users').listDocuments().then(users =>
						Promise.all(users.map(user => user.delete()))
					),
					deckRef.collection('permissions').listDocuments().then(permissions =>
						Promise.all(permissions.map(permission => permission.delete()))
					),
					deckRef.collection('cards').listDocuments().then(cards =>
						Promise.all(cards.map(card => card.delete()))
					)
				])
				: new functions.https.HttpsError('permission-denied', 'You must be the owner of the deck to delete it') as any
		)
	} else
		return new functions.https.HttpsError('unauthenticated', 'You must be signed in and pass in a deckId')
})

function getReputationActionDeckRatingRemovedFromNumber(rating: number): ReputationAction | null {
	switch (rating) {
	case 1:
		return ReputationAction.didGet1StarDeckRatingRemoved
	case 2:
		return ReputationAction.didGet2StarDeckRatingRemoved
	case 4:
		return ReputationAction.didGet4StarDeckRatingRemoved
	case 5:
		return ReputationAction.didGet1StarDeckRatingRemoved
	default:
		return null
	}
}

function getReputationActionDeckRatingFromNumber(rating: number): ReputationAction | null {
	switch (rating) {
	case 1:
		return ReputationAction.didGet1StarDeckRating
	case 2:
		return ReputationAction.didGet2StarDeckRating
	case 4:
		return ReputationAction.didGet4StarDeckRating
	case 5:
		return ReputationAction.didGet1StarDeckRating
	default:
		return null
	}
}