import functions from 'firebase-functions'
import admin from 'firebase-admin'
import Batch from 'firestore-batch'

import Card from '..'
import Deck from '../../Deck'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onCreate(async (snapshot, { params: { deckId } }) => {
		const deck = await Deck.fromId(deckId)
		const card = new Card(snapshot)
		
		return Promise.all([
			card.incrementSectionCardCount(deckId),
			card.incrementDeckCardCount(deckId),
			createUserNodeCards(deck, card)
		])
	})

const createUserNodeCards = async (deck: Deck, card: Card) => {
	const currentUserIds = await Deck.currentUsers(deck.id)
	
	const batch = new Batch(firestore)
	
	await Promise.all(currentUserIds.map(async uid => {
		const userDeckRef = firestore.doc(`users/${uid}/decks/${deck.id}`)
		
		if ( // If you haven't unlocked the section yet, exit
			!card.isUnsectioned &&
			((await userDeckRef.get()).get('sections') ?? {})[card.sectionId] === undefined
		)
			return
		
		batch.set(
			firestore.doc(`users/${uid}/decks/${deck.id}/cards/${card.id}`),
			{ new: true, section: card.sectionId, due: new Date }
		)
		
		const updateData: FirebaseFirestore.UpdateData = {
			unlockedCardCount: admin.firestore.FieldValue.increment(1)
		}
		
		// Don't update the due card counts if you're the creator, because it would have already been updated client-side
		if (uid !== deck.creatorId) {
			updateData.dueCardCount = admin.firestore.FieldValue.increment(1)
			updateData[
				card.isUnsectioned
					? 'unsectionedDueCardCount'
					: `sections.${card.sectionId}`
			] = admin.firestore.FieldValue.increment(1)
		}
		
		batch.update(userDeckRef, updateData)
	}))
	
	return batch.commit()
}
