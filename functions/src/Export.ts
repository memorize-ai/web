import * as functions from 'firebase-functions'

import Deck from './Deck'

export const exportDeck = functions.https.onCall((data, context) => {
	const deckId: string | undefined = data.deckId
	return context.auth && deckId
		? Deck.export(deckId)
		: new functions.https.HttpsError('unauthenticated', 'You must be signed in and pass in a deckId')
})