import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onDelete(snapshot =>
	new Deck(snapshot).deleteIndex()
)
