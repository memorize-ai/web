import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default functions.firestore
	.document('users/{uid}/decks/{deckId}/cards/{cardId}')
	.onCreate((_snapshot, { params: { uid, deckId } }) =>
		firestore.doc(`users/${uid}/decks/${deckId}`).update({
			unlockedCardCount: admin.firestore.FieldValue.increment(1)
		})
	)
