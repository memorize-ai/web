import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export const permissionCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_snapshot, context) =>
	firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).set({ mastered: 0 })
)

export const permissionDeleted = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).delete()
)