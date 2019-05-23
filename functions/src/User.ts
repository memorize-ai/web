import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Slug from './Slug'
import Deck from './Deck'

const firestore = admin.firestore()
const auth = admin.auth()

export const userCreated = functions.firestore.document('users/{uid}').onCreate((change, context) => {
	const uid = context.params.uid
	const data = change.data()!
	return Promise.all([
		updateDisplayName(uid, data.name),
		data.slug ? Promise.resolve() : Slug.find(data.name).then(slug =>
			firestore.doc(`users/${uid}`).update({ slug, lastNotification: 0 })
		)
	])
})

export const userUpdated = functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const afterName = change.after.data()!.name
	return afterName === change.before.data()!.name ? Promise.resolve() : updateDisplayName(context.params.uid, afterName)
})

export const userDeleted = functions.auth.user().onDelete(user =>
	firestore.doc(`users/${user.uid}`).delete()
)

export const deckAdded = functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((_snapshot, context) =>
	Deck.user(context.params.uid, context.params.deckId).then(user =>
		Promise.all([
			Deck.updateDownloads(context.params.deckId, { total: user!.past ? 0 : 1, current: 1 }),
			firestore.doc(`decks/${context.params.deckId}/users/${context.params.uid}`).update({ past: true, current: true })
		])
	)
)

export const deckRemoved = functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((_snapshot, context) =>
	Promise.all([
		Deck.updateDownloads(context.params.deckId, { total: 0, current: -1 }),
		firestore.doc(`decks/${context.params.deckId}/users/${context.params.uid}`).update({ current: false })
	])
)

function updateDisplayName(uid: string, displayName: string): Promise<any> {
	return displayName ? auth.updateUser(uid, { displayName }) : Promise.resolve()
}