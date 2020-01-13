import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'

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

const deleteUserNodeCards = (deckId: string, card: Card) =>
	Deck.currentUsers(deckId).then(currentUserIds =>
		Promise.all(currentUserIds.map(uid =>
			firestore
				.doc(`users/${uid}/decks/${deckId}/cards/${card.id}`)
				.delete()
		))
	)
