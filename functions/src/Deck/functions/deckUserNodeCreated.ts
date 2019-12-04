import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((snapshot, { params: { uid } }) => {
	const deck = new Deck(snapshot)
	return User.fromId(uid).then(user =>
		Promise.all([
			deck.incrementCurrentUserCount(),
			user.allDecks.includes(deck.id)
				? Promise.resolve(null)
				: deck.incrementAllTimeUserCount(),
			user.addDeckToAllDecks(deck.id),
			User.incrementDeckCount(uid)
		])
	)
})
