import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 1 minutes').onRun(_context =>
	firestore.collection('users').listDocuments().then(users =>
		Promise.all(users.map(({ id: uid }) =>
			firestore.collection(`users/${uid}/decks`).listDocuments().then(decks =>
				Promise.all(decks.map(({ id: deckId }) =>
					Deck.numberOfDueCards(uid, deckId).then(dueCardCount =>
						firestore.doc(`users/${uid}/decks/${deckId}`).update({ dueCardCount })
					)
				))
			)
		))
	)
)
