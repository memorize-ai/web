import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'
import Batch from 'firestore-batch'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onUpdate(({ before, after }, { params: { deckId } }) => {
		const oldCard = new Card(before)
		const newCard = new Card(after)
		
		return oldCard.sectionId === newCard.sectionId
			? Promise.resolve()
			: Promise.all([
				oldCard.decrementSectionCardCount(deckId),
				newCard.incrementSectionCardCount(deckId),
				updateUserNodeSections(deckId, newCard)
			])
	})

const updateUserNodeSections = async (deckId: string, card: Card) => {
	const currentUserIds = await Deck.currentUsers(deckId)
	
	const batch = new Batch(firestore)
	
	for (const uid of currentUserIds)
		firestore
			.doc(`users/${uid}/decks/${deckId}/cards/${card.id}`)
			.update({ section: card.sectionId })
	
	return batch.commit()
}
