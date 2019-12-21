import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onUpdate(({ before, after }, { params: { deckId } }) => {
		const oldCard = new Card(before)
		const newCard = new Card(after)
		
		return oldCard.sectionId === newCard.sectionId
			? Promise.resolve()
			: Promise.all([
				oldCard.decrementSectionCardCount(deckId),
				newCard.incrementSectionCardCount(deckId)
			])
	})
