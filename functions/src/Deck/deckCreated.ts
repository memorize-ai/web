import * as functions from 'firebase-functions'

import Deck from './Deck'

export default functions.firestore.document('decks/{deckId}').onCreate(snapshot =>
	new Deck(snapshot).insertIntoTopDecks()
)
