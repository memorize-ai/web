import * as functions from 'firebase-functions'

import Card from '..'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onCreate((snapshot, { params: { deckId } }) =>
		new Card(snapshot).incrementSectionCardCount(deckId)
	)
