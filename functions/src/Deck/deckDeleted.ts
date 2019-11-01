import * as functions from 'firebase-functions'

import Deck from './Deck'

export default functions.firestore.document('decks/{deckId}').onDelete(snapshot =>
	new Deck(snapshot).removeFromTopDecks()
)
