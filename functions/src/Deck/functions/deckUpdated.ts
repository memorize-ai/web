import * as functions from 'firebase-functions'

import Deck from '..'
import { cauterize } from '../../utils'

export default functions.firestore.document('decks/{deckId}').onUpdate(cauterize(({ before, after }) => {
	const oldDeck = new Deck(before)
	const newDeck = new Deck(after)
	
	if (oldDeck.dateLastUpdated.getTime() !== newDeck.dateLastUpdated.getTime())
		return Promise.resolve()
	
	const promises: Promise<any>[] = []
	
	if (oldDeck.wasUpdatedByUser(newDeck))
		promises.push(newDeck.updateLastUpdated())
	
	if (oldDeck.shouldIndex(newDeck))
		promises.push(newDeck.index())
	
	promises.push(newDeck.cache())
	
	return Promise.all(promises)
}))
