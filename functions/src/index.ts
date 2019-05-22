import * as admin from 'firebase-admin'
admin.initializeApp()

export { userCreated, userUpdated, userDeleted, deckAdded, deckRemoved } from './User'
export { deckCreated, deckUpdated, deckDeleted, viewDeck, rateDeck } from './Deck'
export { cardCreated, cardDeleted } from './Card'
export { permissionCreated, permissionDeleted } from './Permission'
export { historyCreated } from './History'