import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'
import Batch from '../../Utils/Batch'

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
				updateUserNodeSections(deckId, oldCard, newCard)
			])
	})

const updateUserNodeSections = async (deckId: string, oldCard: Card, newCard: Card) => {
	const currentUserIds = await Deck.currentUsers(deckId)
	
	const batch = new Batch
	
	await Promise.all(currentUserIds.map(async uid => {
		const { docs } = await firestore
			.collection(`users/${uid}/decks/${deckId}/cards`)
			.where('section', '==', oldCard.sectionId)
			.get()
		
		for (const { ref } of docs)
			batch.update(ref, { section: newCard.sectionId })
	}))
	
	return batch.commit()
}
