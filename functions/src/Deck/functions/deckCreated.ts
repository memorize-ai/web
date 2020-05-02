import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onCreate(snapshot => {
	const deck = new Deck(snapshot)
	
	return Promise.all([
		deck.index(),
		deck.cache(),
		Deck.incrementCounter()
	])
})
