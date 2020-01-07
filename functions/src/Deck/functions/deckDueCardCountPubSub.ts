import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'
import DeckUserData from '../UserData'
import Section from '../../Section'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 1 minutes').onRun(() => {
	const deckCache: Record<string, Deck> = {}
	const sectionCache: Record<string, Section> = {}
	
	return firestore.collection('users').listDocuments().then(users =>
		Promise.all(users.map(({ id: uid }) =>
			firestore.collection(`users/${uid}/decks`).get().then(decks =>
				Promise.all(decks.docs.map(async deckSnapshot => {
					const deckId = deckSnapshot.id
					
					const deckUserData = new DeckUserData(deckSnapshot)
					const cardUserData = await Deck.cardUserData(uid, deckId)
					
					return Promise.all([
						Section.numberOfDueCards(deckUserData, cardUserData, sectionCache),
						Deck.numberOfDueCards(uid, cardUserData, deckCache)
					]).then(([sections, dueCardCount]) =>
						firestore.doc(`users/${uid}/decks/${deckId}`).update({
							sections,
							dueCardCount
						})
					)
				}))
			)
		))
	)
})
