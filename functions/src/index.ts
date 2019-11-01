import { initializeApp } from 'firebase-admin'

initializeApp()

export { deckCreated, deckUpdated, deckDeleted } from './Deck'
export { userCreated, userUpdated } from './User'
