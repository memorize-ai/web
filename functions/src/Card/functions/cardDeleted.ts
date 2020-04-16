import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Batch from 'firestore-batch'

import Card from '..'
import CardUserData from '../UserData'
import Deck from '../../Deck'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onDelete(async (snapshot, { params: { deckId } }) => {
		const deck = await Deck.fromId(deckId)
		const card = new Card(snapshot)
		
		return Promise.all([
			card.decrementSectionCardCount(deckId),
			card.decrementDeckCardCount(deckId),
			deleteUserNodeCards(deck, card)
		])
	})

const deleteUserNodeCards = async (deck: Deck, card: Card) => {
	const currentUserIds = await Deck.currentUsers(deck.id)
	
	const batch = new Batch(firestore)
	
	await Promise.all(currentUserIds.map(async uid => {
		const userDeckRef = firestore.doc(`users/${uid}/decks/${deck.id}`)
		const userCardRef = userDeckRef.collection('cards').doc(card.id)
		
		if ( // If you haven't unlocked the section yet, exit
			!card.isUnsectioned &&
			((await userDeckRef.get()).get('sections') ?? {})[card.sectionId] === undefined
		)
			return
		
		batch.delete(userCardRef)
		
		const updateData: FirebaseFirestore.UpdateData = {
			unlockedCardCount: admin.firestore.FieldValue.increment(-1)
		}
		
		// Don't update the due card counts if you're the creator, because it would have already been updated client-side
		if (uid !== deck.creatorId && new CardUserData(await userCardRef.get()).isDue) {
			updateData.dueCardCount = admin.firestore.FieldValue.increment(-1)
			updateData[
				card.isUnsectioned
					? 'unsectionedDueCardCount'
					: `sections.${card.sectionId}`
			] = admin.firestore.FieldValue.increment(-1)
		}
		
		batch.update(userDeckRef, updateData)
	}))
	
	return batch.commit()
}
