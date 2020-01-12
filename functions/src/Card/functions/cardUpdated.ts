import * as functions from 'firebase-functions'

import Card from '..'
import Deck from '../../Deck'

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onUpdate(({ before, after }, { params: { deckId } }) => {
		const oldCard = new Card(before)
		const newCard = new Card(after)
		
		return oldCard.sectionId === newCard.sectionId
			? Promise.resolve()
			: Promise.all([
				oldCard.decrementSectionCardCount(deckId),
				newCard.incrementSectionCardCount(deckId),
				Deck.fromId(deckId).then(deck =>
					updateUserNodeSections(deck, oldCard, newCard)
				)
			])
	})

const updateUserNodeSections = (deck: Deck, oldCard: Card, newCard: Card) =>
