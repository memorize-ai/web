import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onCreate(snapshot =>
	Promise.all([
		new Deck(snapshot).index(),
		Deck.incrementCounter()
	])
)
