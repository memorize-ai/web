import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((_snapshot, { params: { uid, deckId } }) => {
	User.fromId(uid).then(user =>
		Promise.all([
			Deck.incrementCurrentUserCount(deckId),
			user.allDecks.includes(deckId)
				? Promise.resolve(null)
				: Deck.incrementAllTimeUserCount(deckId),
			user.addDeckToAllDecks(deckId),
			User.incrementDeckCount(uid)
		])
	)
})
