import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'
import DeckUserData from '../UserData'
import Section from '../../Section'
import Card from '../../Card'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 1 minutes').onRun(() => {
	const deckCache: Record<string, Deck> = {}
	const sectionCache: Record<string, Section> = {}
	const cardCache: Record<string, Card> = {}
	
	return firestore.collection('users').listDocuments().then(users =>
		Promise.all(users.map(({ id: uid }) =>
			firestore.collection(`users/${uid}/decks`).get().then(decks =>
				Promise.all(decks.docs.map(async deckSnapshot => {
					const deckId = deckSnapshot.id
					
					const deckUserData = new DeckUserData(deckSnapshot)
					const cardUserData = await Deck.cardUserData(uid, deckId, cardCache)
					
					const [sections, dueCardCount] = await Promise.all([
						Section.numberOfDueCards(deckUserData, cardUserData, sectionCache),
						Deck.numberOfDueCards(
							deckId,
							cardUserData.map(({ userData }) => userData),
							deckCache
						)
					])
					
					const { numberOfUnsectionedCards } = deckCache[deckId]
					
					return firestore.doc(`users/${uid}/decks/${deckId}`).update({
						unsectionedDueCardCount: cardUserData
							.filter(({ card }) => card.isUnsectioned)
							.reduce((acc, { userData: { isDue } }) =>
								acc - (isDue ? 0 : 1)
							, numberOfUnsectionedCards),
						sections,
						dueCardCount
					})
				}))
			)
		))
	)
})
