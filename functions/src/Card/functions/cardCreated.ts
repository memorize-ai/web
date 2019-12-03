import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onCreate((snapshot, { params: { deckId } }) => {
		const card = new Card(snapshot)
		return Promise.all([
			card.incrementSectionCardCount(deckId),
			card.incrementDeckCardCount(deckId)
		])
	})
