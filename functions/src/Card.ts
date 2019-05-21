import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	firestore.doc(`decks/${context.params.deckId}`).update({ count: admin.firestore.FieldValue.increment(1) })
)

export { cardCreated }