import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'

const firestore = admin.firestore()

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
				updateUserNodeSections(deckId, oldCard, newCard)
			])
	})

const updateUserNodeSections = (deckId: string, oldCard: Card, newCard: Card) =>
	Deck.currentUsers(deckId).then(currentUserIds =>
		Promise.all(currentUserIds.map(uid =>
			firestore
				.collection(`users/${uid}/decks/${deckId}/cards`)
				.where('section', '==', oldCard.sectionId)
				.get()
				.then(({ docs }) =>
					Promise.all(docs.map(({ ref }) =>
						ref.update({ section: newCard.sectionId })
					))
				)
		))
	)
