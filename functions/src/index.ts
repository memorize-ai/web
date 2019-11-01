import { initializeApp } from 'firebase-admin'

initializeApp()

export { deckCreated, deckUpdated, deckDeleted } from './Deck/functions'
export { userCreated, userUpdated, userDeleted } from './User/functions'
