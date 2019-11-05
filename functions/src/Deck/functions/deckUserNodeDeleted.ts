import * as functions from 'firebase-functions'

import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((_snapshot, { params: { uid } }) =>
	User.decrementDeckCount(uid)
)
