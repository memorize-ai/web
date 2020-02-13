import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'
import Batch from 'firestore-batch'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onDelete((snapshot, { params: { deckId } }) => {
		const card = new Card(snapshot)
		
		return Promise.all([
			card.decrementSectionCardCount(deckId),
			card.decrementDeckCardCount(deckId),
			deleteUserNodeCards(deckId, card)
		])
	})

const deleteUserNodeCards = async (deckId: string, card: Card) => {
	const currentUserIds = await Deck.currentUsers(deckId)
	
	const batch = new Batch(firestore)
	
	for (const uid of currentUserIds) {
		batch.delete(firestore.doc(`users/${uid}/decks/${deckId}/cards/${card.id}`))
		batch.update(
			firestore.doc(`users/${uid}/decks/${deckId}`),
			{ unlockedCardCount: admin.firestore.FieldValue.increment(-1) }
		)
	}
	
	return batch.commit()
}
