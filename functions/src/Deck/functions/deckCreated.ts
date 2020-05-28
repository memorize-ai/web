import * as functions from 'firebase-functions'

import Deck from '..'
import { cauterize } from '../../utils'

export default functions.firestore.document('decks/{deckId}').onCreate(cauterize(snapshot => {
	const deck = new Deck(snapshot)
	
	return Promise.all([
		deck.index(),
		deck.cache(),
		deck.initializeNextPostedCard(),
		Deck.incrementCounter()
	])
}))
