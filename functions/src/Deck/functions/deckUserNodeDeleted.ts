import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((snapshot, { params: { uid, deckId } }) => {
	const oldRating: number | undefined = snapshot.get('rating')
	
	return Promise.all([
		Deck.decrementCurrentUserCount(deckId),
		User.decrementDeckCount(uid),
		oldRating
			? Deck.updateRating(deckId, oldRating, undefined)
			: Promise.resolve(null),
			Deck.removeUserFromCurrentUsers(deckId, uid)
	])
})
