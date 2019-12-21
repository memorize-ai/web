import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onDelete((snapshot, { params: { deckId } }) => {
		const card = new Card(snapshot)
		
		return Promise.all([
			card.decrementSectionCardCount(deckId),
			card.decrementDeckCardCount(deckId)
		])
	})
