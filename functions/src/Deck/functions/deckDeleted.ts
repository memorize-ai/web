import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.firestore.document('decks/{deckId}').onDelete((snapshot, { params: { deckId } }) =>
	Promise.all([
		new Deck(snapshot).deleteIndex(),
		Deck.currentUsers(deckId).then(currentUsers => {
			const batch = firestore.batch()
			
			for (const uid of currentUsers)
				batch.delete(firestore.doc(`users/${uid}/decks/${deckId}`))
			
			return batch.commit()
		})
	])
)
