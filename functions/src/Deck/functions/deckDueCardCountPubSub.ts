import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 1 minutes').onRun(_context => {
	const cache: { [id: string]: Deck } = {}
	
	return firestore.collection('users').listDocuments().then(users =>
		Promise.all(users.map(({ id: uid }) =>
			firestore.collection(`users/${uid}/decks`).listDocuments().then(decks =>
				Promise.all(decks.map(({ id: deckId }) =>
					Deck.numberOfDueCards(uid, deckId, cache).then(numberOfDueCards =>
						Deck.updateDueCardCount(uid, deckId, numberOfDueCards)
					)
				))
			)
		))
	)
})
