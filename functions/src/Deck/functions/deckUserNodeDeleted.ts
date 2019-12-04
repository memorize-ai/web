import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((snapshot, { params: { uid } }) =>
	Promise.all([
		new Deck(snapshot).decrementCurrentUserCount(),
		User.decrementDeckCount(uid)
	])
)
