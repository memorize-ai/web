import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onDelete((snapshot, { params: { deckId } }) =>
	Promise.all([
		new Deck(snapshot).deleteIndex(),
		Deck.delete(deckId),
		Deck.deleteAssets(deckId),
		Deck.decrementCounter()
	])
)
