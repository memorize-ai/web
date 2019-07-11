import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Slug from './Slug'
import Deck from './Deck'
import Algolia from './Algolia'
import Permission, { PermissionRole } from './Permission'

const firestore = admin.firestore()
const storage = admin.storage().bucket('us')
const auth = admin.auth()

export default class User {
	static updateLastActivity(uid: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}`).update({ lastActivity: new Date })
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