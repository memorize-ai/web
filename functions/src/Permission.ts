import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'

const firestore = admin.firestore()

export const permissionCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_snapshot, context) =>
	Promise.all([
		firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).set({ mastered: 0 }),
		User.updateLastActivity(context.auth!.uid)
	])
)

export const permissionUpdated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onUpdate((_change, context) =>
	User.updateLastActivity(context.auth!.uid)
)

export const permissionDeleted = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onDelete((_snapshot, context) =>
	Promise.all([
		firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).delete(),
		User.updateLastActivity(context.auth!.uid)
	])
)