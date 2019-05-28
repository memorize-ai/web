import * as admin from 'firebase-admin'
admin.initializeApp()

export { rateCard, cardCreated, cardUpdated, cardDeleted } from './Card'
export { deckCreated, deckUpdated, deckDeleted, viewDeck, rateDeck } from './Deck'
export { historyCreated } from './History'
export { confirmInvite, permissionCreated, permissionUpdated, permissionDeleted } from './Permission'
export { settingCreated, settingUpdated, settingDeleted } from './Setting'
export { userCreated, userUpdated, userDeleted, updateLastOnline, deckAdded, deckRemoved } from './User'