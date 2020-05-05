import * as functions from 'firebase-functions'

import Deck from '..'
import User from '../../User'
import { cauterize } from '../../utils'

export default functions
	.runWith({ timeoutSeconds: 540, memory: '2GB' })
	.firestore
	.document('users/{uid}/decks/{deckId}').onCreate(cauterize(async (snapshot, { params: { uid, deckId } }) => {
		const user = await User.fromId(uid)
		
		return Promise.all([
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
			User.addXP((await Deck.fromId(deckId)).creatorId, User.xp.deckDownload)
		])
	}))
