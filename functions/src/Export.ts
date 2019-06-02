import * as functions from 'firebase-functions'

import Deck from './Deck'

export const exportDeck = functions.https.onCall((data, context) => {
	const deckId = data.deckId
	context.auth && deckId
		? Deck.export(deckId)
		: Promise.resolve()
})