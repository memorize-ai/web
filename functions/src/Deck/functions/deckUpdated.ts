import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onUpdate(({ after: snapshot }) => {
	const deck = new Deck(snapshot)
	return Promise.all([
		deck.index(),
		deck.insertIntoTopDecks()
	])
})
