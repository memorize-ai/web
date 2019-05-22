import * as functions from 'firebase-functions'

import Deck from './Deck'

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, true)
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, false)
)