import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'
import User from '../../User'

const firestore = admin.firestore()

export default functions
	.runWith({ timeoutSeconds: 540, memory: '2GB' })
	.firestore
	.document('users/{uid}/decks/{deckId}').onDelete((snapshot, { params: { uid, deckId } }) => {
		const oldRating: number | undefined = snapshot.get('rating')
		
		return Promise.all([
			Deck.decrementCurrentUserCount(deckId),
			User.decrementDeckCount(uid),
			oldRating
				? Deck.updateRating(uid, deckId, oldRating, undefined)
				: Promise.resolve(null),
			Deck.removeUserFromCurrentUsers(deckId, uid),
			removeAllCardsAndHistory(uid, deckId)
		])
	})

const removeAllCardsAndHistory = (uid: string, deckId: string) =>
	firestore.collection(`users/${uid}/decks/${deckId}/cards`).listDocuments().then(cards => {
		const batch = firestore.batch()
		
		for (const card of cards) {
			batch.delete(card)
			card.collection('history').listDocuments().then(historyNodes =>
				historyNodes.forEach(historyNode =>
					batch.delete(historyNode)
				)
			)
		}
		
		return batch.commit()
	})
