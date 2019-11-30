import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onUpdate(({ before, after }, { params: { deckId } }) =>
		before.get('section') === after.get('section')
			? Promise.resolve()
			: Promise.all([
				new Card(before).decrementSectionCardCount(deckId),
				new Card(after).incrementSectionCardCount(deckId)
			])
	)
