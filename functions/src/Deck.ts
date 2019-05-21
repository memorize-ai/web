import * as functions from 'firebase-functions'

import Algolia from './Algolia'

const deckCreated = functions.firestore.document('decks/{deckId}').onCreate(Algolia.createDeck)
const deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(Algolia.updateDeck)
const deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(Algolia.deleteDeck)

export { deckCreated, deckUpdated, deckDeleted }