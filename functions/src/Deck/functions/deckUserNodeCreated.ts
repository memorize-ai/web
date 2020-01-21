import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'

export default functions
	.runWith({ timeoutSeconds: 540, memory: '2GB' })
	.firestore
	.document('users/{uid}/decks/{deckId}').onCreate((snapshot, { params: { uid, deckId } }) =>
		User.fromId(uid).then(user =>
			Promise.all([
				Deck.incrementCurrentUserCount(deckId),
				user.allDecks.includes(deckId)
					? Promise.resolve(null)
					: Deck.incrementAllTimeUserCount(deckId),
				user.addDeckToAllDecks(deckId),
				User.incrementDeckCount(uid),
				Deck.addUserToCurrentUsers(deckId, uid),
				Deck.incrementDownloadCount(deckId),
				Deck.addInitialCardsToUserNode(
					uid,
					deckId,
					Object.keys(snapshot.get('sections') ?? {})
				),
				Deck.fromId(deckId).then(deck =>
					User.addXP(deck.creatorId, User.xp.deckDownload)
				)
			])
		)
	)
