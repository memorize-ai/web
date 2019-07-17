import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Slug from './Slug'
import Deck from './Deck'
import Algolia from './Algolia'
import Notification from './Notification'
import Permission, { PermissionRole } from './Permission'

const firestore = admin.firestore()
const storage = admin.storage().bucket('us')
const auth = admin.auth()

export default class User {
	static updateLastActivity(uid: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}`).update({ lastActivity: new Date })
	}

	static updateLastNotification(uid: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}`).update({ lastNotification: new Date })
	}

	static updateRoleForDeck(uid: string, deckId: string, role: PermissionRole): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/decks/${deckId}`)
		return doc.get().then(deck =>
			deck.exists
				? doc.update({ role: role === PermissionRole.none ? admin.firestore.FieldValue.delete() : Permission.stringify(role) })
				: Promise.resolve() as Promise<any>
		)
	}

	static addDeck(uid: string, deckId: string, role: PermissionRole): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/decks/${deckId}`)
		return doc.get().then(deck => {
			if (deck.exists)
				return doc.update({ hidden: false })
			const updateObject: any = { mastered: 0, hidden: false }
			if (role !== PermissionRole.none)
				updateObject.role = Permission.stringify(role)
			return doc.set(updateObject)
		})
	}

	static updateViews(id: string, { total, unique }: { total: number, unique: number }): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${id}`)
		return doc.get().then(user => {
			const views = user.get('views')
			return doc.update({
				views: {
					total: views.total + total,
					unique: views.unique + unique
				}
			})
		})
	}

	static getLastNotificationDifference(snapshot: FirebaseFirestore.DocumentSnapshot, date: number = Date.now()): number {
		return date - snapshot.get('lastNotification').toMillis()
	}

	static getTokens(uid: string): Promise<string[]> {
		return firestore.collection(`users/${uid}/tokens`).get().then(tokens =>
			tokens.docs.filter(token => token.get('enabled')).map(token => token.id)
		)
	}
}

export const userCreated = functions.firestore.document('users/{uid}').onCreate((snapshot, context) => {
	const uid = context.params.uid
	const name = snapshot.get('name')
	const now = new Date
	return Promise.all([
		Algolia.create({ index: Algolia.indices.users, snapshot }),
		firestore.doc(`users/${uid}`).update({ lastNotification: now, joined: now, lastOnline: now, lastActivity: now }),
		name ? updateUser(uid, name) : Promise.resolve() as Promise<any>
	])
})

export const userUpdated = functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const afterName = change.after.get('name')
	return change.before.get('lastNotification') === change.after.get('lastNotification') && change.before.get('lastOnline').isEqual(change.after.get('lastOnline')) && change.before.get('lastActivity').isEqual(change.after.get('lastActivity'))
		? Promise.all([
			Algolia.update({ index: Algolia.indices.users, change }),
			change.before.get('name') === afterName
				? Promise.resolve() as Promise<any>
				: updateUser(context.params.uid, afterName),
			User.updateLastActivity(context.params.uid)
		])
		: Promise.resolve()
})

export const userDeleted = functions.auth.user().onDelete(user => {
	const id = user.uid
	const path = `users/${id}`
	return Promise.all([
		Algolia.delete({ index: Algolia.indices.users, id }),
		firestore.doc(path).delete(),
		storage.file(path).delete()
	])
})

export const updateLastOnline = functions.https.onCall((_data, context) =>
	context.auth ? firestore.doc(`users/${context.auth.uid}`).update({ lastOnline: new Date }) : Promise.resolve()
)

export const viewUser = functions.https.onCall((data, context) => {
	const otherUid = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	const viewerDoc = firestore.doc(`users/${otherUid}/viewers/${uid}`)
	return viewerDoc.get().then(viewer =>
		Promise.all([
			User.updateLastActivity(uid),
			viewer.exists
				? User.updateViews(otherUid, { total: 1, unique: 0 }) as Promise<any>
				: Promise.all([
					viewerDoc.set({ following: false }),
					User.updateViews(otherUid, { total: 1, unique: 1 })
				])
		])
	)
})

export const followUser = functions.https.onCall((data, context) => {
	const otherUid = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	if (uid === otherUid) return new functions.https.HttpsError('failed-precondition', 'You cannot follow yourself')
	const setObject = { current: true, dateFollowed: new Date }
	const setDoc = (path: string) =>
		firestore.doc(path).set(setObject)
	return Promise.all([
		setDoc(`users/${otherUid}/followers/${uid}`),
		setDoc(`users/${uid}/following/${otherUid}`),
		firestore.doc(`users/${otherUid}/viewers/${uid}`).set({ following: true })
	])
})

export const unfollowUser = functions.https.onCall((data, context) => {
	const otherUid = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	const updateObject = { current: false, dateUnfollowed: new Date }
	const updateDoc = (path: string) =>
		firestore.doc(path).update(updateObject)
	return Promise.all([
		updateDoc(`users/${otherUid}/followers/${uid}`),
		updateDoc(`users/${uid}/following/${otherUid}`),
		firestore.doc(`users/${otherUid}/viewers/${uid}`).set({ following: false })
	])
})

export const followerCreated = functions.firestore.document('users/{uid}/followers/{followerId}').onCreate((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followersCount: admin.firestore.FieldValue.increment(1) })
)

export const followerUpdated = functions.firestore.document('users/{uid}/followers/{followerId}').onUpdate((change, context) => {
	const isFollowing = change.after.get('current')
	return change.before.get('current') === isFollowing
		? Promise.resolve()
		: firestore.doc(`users/${context.params.uid}`).update({ followersCount: admin.firestore.FieldValue.increment(isFollowing ? 1 : -1) })
})

export const followerDeleted = functions.firestore.document('users/{uid}/followers/{followerId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followersCount: admin.firestore.FieldValue.increment(-1) })
)

export const followingCreated = functions.firestore.document('users/{uid}/following/{followingId}').onCreate((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(1) })
)

export const followingUpdated = functions.firestore.document('users/{uid}/following/{followingId}').onUpdate((change, context) => {
	const isFollowing = change.after.get('current')
	return change.before.get('current') === isFollowing
		? Promise.resolve()
		: firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(isFollowing ? 1 : -1) })
})

export const followingDeleted = functions.firestore.document('users/{uid}/following/{followingId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(-1) })
)

export const deckAdded = functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((_snapshot, context) =>
	Deck.user(context.params.uid, context.params.deckId).then(user =>
		Promise.all([
			Deck.updateDownloads(context.params.deckId, { total: user ? user.past ? 0 : 1 : 0, current: 1 }),
			Deck.doc(context.params.deckId, `users/${context.params.uid}`).update({ past: true, current: true }),
			User.updateLastActivity(context.params.uid)
		])
	)
)

export const deckRemoved = functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((_snapshot, context) =>
	Promise.all([
		Deck.updateDownloads(context.params.deckId, { total: 0, current: -1 }),
		Deck.doc(context.params.deckId, `users/${context.params.uid}`).update({ current: false }),
		User.updateLastActivity(context.params.uid)
	])
)

function updateUser(uid: string, name: string): Promise<any[]> {
	return Promise.all([
		updateDisplayName(uid, name),
		updateSlugForName(uid, name)
	])
}

function updateDisplayName(uid: string, displayName: string): Promise<admin.auth.UserRecord> {
	return auth.updateUser(uid, { displayName })
}

function updateSlugForName(uid: string, name: string): Promise<FirebaseFirestore.WriteResult> {
	return Slug.find(name).then(slug =>
		firestore.doc(`users/${uid}`).update({ slug })
	)
}