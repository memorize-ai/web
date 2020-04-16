import functions from 'firebase-functions'

import Section from '..'

export default functions.firestore
	.document('decks/{deckId}/sections/{sectionId}')
	.onDelete((snapshot, { params: { deckId } }) =>
		new Section(snapshot).deleteCards(deckId)
	)
