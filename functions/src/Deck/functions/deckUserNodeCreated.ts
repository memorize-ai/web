import * as functions from 'firebase-functions'

import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((_snapshot, { params: { uid } }) =>
	User.incrementDeckCount(uid)
)
