import Cache from 'models/Cache'
import Card from 'models/Card'
import firebase from 'lib/firebase'

import 'firebase/firestore'

const firestore = firebase.firestore()

const cards = new Cache<string, Card, [string]>(async (cardId, deckId) =>
	Card.fromSnapshot(
		await firestore.doc(`decks/${deckId}/cards/${cardId}`).get(),
		null
	)
)

export default cards
