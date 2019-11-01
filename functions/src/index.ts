import { initializeApp } from 'firebase-admin'

initializeApp()

export { userCreated, userUpdated } from './User'
export { deckUpdated } from './Deck'
