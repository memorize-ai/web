import * as admin from 'firebase-admin'
admin.initializeApp()

export { app } from './App'
export { rateCard, cardCreated, cardUpdated, cardDeleted } from './Card'
export { cardDraftCreated, cardDraftUpdated, cardDraftDeleted } from './CardDraft'
export { deckCreated, deckUpdated, deckDeleted, viewDeck, rateDeck, canEditDeck } from './Deck'
export { exportDeck } from './Export'
export { historyCreated } from './History'
export { confirmInvite } from './Invite'
export { permissionCreated, permissionUpdated, permissionDeleted } from './Permission'
export { settingCreated, settingUpdated, settingDeleted } from './Setting'
export { uploadCreated, uploadUpdated, uploadDeleted, uploadStorageFinalized } from './Upload'
export { userCreated, userUpdated, userDeleted, updateLastOnline, deckAdded, deckRemoved } from './User'