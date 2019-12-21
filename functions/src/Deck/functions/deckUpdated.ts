import * as functions from 'firebase-functions'

import Deck from '..'

export default functions.firestore.document('decks/{deckId}').onUpdate(({ before, after }) => {
	const oldDeck = new Deck(before)
	const newDeck = new Deck(after)
	
	const promises: Promise<any>[] = [newDeck.index()]
	
	if (!(
		JSON.stringify(oldDeck.topics) === JSON.stringify(newDeck.topics) &&
		oldDeck.hasImage === newDeck.hasImage &&
		oldDeck.name === newDeck.name &&
		oldDeck.subtitle === newDeck.subtitle &&
		oldDeck.description === newDeck.description
	))
		promises.push(newDeck.updateLastUpdated())
	
	return Promise.all(promises)
})
