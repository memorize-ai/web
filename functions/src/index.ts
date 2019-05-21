import * as admin from 'firebase-admin'
admin.initializeApp()

import { userCreated, userUpdated, userDeleted } from './User'
import { deckCreated, deckUpdated, deckDeleted } from './Deck'
import { cardCreated } from './Card'
import { permissionCreated, permissionDeleted } from './Permission'
import { historyCreated } from './History'

exports.deckCreated = deckCreated
exports.deckUpdated = deckUpdated
exports.deckDeleted = deckDeleted
exports.cardCreated = cardCreated
exports.permissionCreated = permissionCreated
exports.permissionDeleted = permissionDeleted
exports.userCreated = userCreated
exports.userUpdated = userUpdated
exports.userDeleted = userDeleted
exports.historyCreated = historyCreated