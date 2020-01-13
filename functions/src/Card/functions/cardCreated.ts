import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onCreate((snapshot, { params: { deckId } }) => {
		const card = new Card(snapshot)
		
		return Promise.all([
			card.incrementSectionCardCount(deckId),
			card.incrementDeckCardCount(deckId),
			createUserNodeCards(deckId, card)
		])
	})

const createUserNodeCards = (deckId: string, card: Card) =>
	Deck.currentUsers(deckId).then(currentUserIds =>
		Promise.all(currentUserIds.map(uid =>
			firestore
				.doc(`users/${uid}/decks/${deckId}/cards/${card.id}`)
				.set({
					new: true,
					section: card.sectionId
				})
		))
	)
