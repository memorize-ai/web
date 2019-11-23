import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onDelete(snapshot => {
	const deck = new Deck(snapshot)
	return Promise.all([
		deck.deleteIndex(),
		deck.removeFromTopDecks()
	])
})
