import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((_snapshot, { params: { uid, deckId } }) =>
	Promise.all([
		Deck.decrementCurrentUserCount(deckId),
		User.decrementDeckCount(uid)
	])
)
