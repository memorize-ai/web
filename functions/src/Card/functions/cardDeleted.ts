import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onDelete((snapshot, { params: { deckId } }) =>
		new Card(snapshot).decrementSectionCardCount(deckId)
	)
