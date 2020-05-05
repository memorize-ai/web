import * as functions from 'firebase-functions'

import Deck from '..'
import { cauterize } from '../../utils'

export default functions.firestore
	.document('decks/{deckId}')
	.onDelete(cauterize((snapshot, { params: { deckId } }) =>
		Promise.all([
			new Deck(snapshot).deleteIndex(),
			Deck.delete(deckId),
			Deck.deleteFromStorage(deckId),
			Deck.decrementCounter()
		])
	))
