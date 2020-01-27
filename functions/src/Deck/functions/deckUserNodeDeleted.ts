import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'
import User from '../../User'
import { batchWithChunks } from '../../helpers'

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
	firestore.collection(`users/${uid}/decks/${deckId}/cards`).listDocuments().then(async cards => {
		const documentReferences: FirebaseFirestore.DocumentReference[] = []
		
		for (const card of cards) {
			documentReferences.push(card)
			
			const historyNodes = await card.collection('history').listDocuments()
			
			historyNodes.forEach(historyNode =>
				documentReferences.push(historyNode)
			)
		}
		
		return batchWithChunks(documentReferences, 500, (chunk, batch) => {
			for (const ref of chunk)
				batch.delete(ref)
		})
	})
