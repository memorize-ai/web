import * as admin from 'firebase-admin'

import CardTrainingData from '../Algorithm/CardTrainingData'
import Deck from '../Deck'
import History from '../History'

const firestore = admin.firestore()

export default class Card {
	id: string
	sectionId: string
	front: string
	back: string
	numberOfViews: number
	numberOfSkips: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.sectionId = snapshot.get('section')
		this.front = snapshot.get('front')
		this.back = snapshot.get('back')
		this.numberOfViews = snapshot.get('viewCount')
		this.numberOfSkips = snapshot.get('skipCount') ?? 0
	}
	
	static fromId = (cardId: string, deckId: string): Promise<Card> =>
		firestore.doc(`decks/${deckId}/cards/${cardId}`).get().then(snapshot =>
			new Card(snapshot)
		)
	
	static trainingData = (uid: string, deckId: string, cardId: string): Promise<CardTrainingData> =>
		firestore.collection(`users/${uid}/decks/${deckId}/cards/${cardId}/history`).get().then(({ docs }) =>
			Card.fromId(cardId, deckId).then(card =>
				new CardTrainingData(
					card,
					docs.map(history =>
						new History(history)
					)
				)
			)
		)
	
	incrementDeckCardCount = Deck.incrementCardCount
	decrementDeckCardCount = Deck.decrementCardCount
	
	get isUnsectioned() {
		return this.sectionId === ''
	}
	
	incrementSectionCardCount = (deckId: string): Promise<FirebaseFirestore.WriteResult> => {
		const increment = admin.firestore.FieldValue.increment(1)
		return this.isUnsectioned
			? firestore.doc(`decks/${deckId}`).update({
				unsectionedCardCount: increment
			})
			: firestore.doc(`decks/${deckId}/sections/${this.sectionId}`).update({
				cardCount: increment
			})
	}
	
	decrementSectionCardCount = (deckId: string): Promise<FirebaseFirestore.WriteResult> => {
		const decrement = admin.firestore.FieldValue.increment(-1)
		return this.isUnsectioned
			? firestore.doc(`decks/${deckId}`).update({
				unsectionedCardCount: decrement
			})
			: firestore.doc(`decks/${deckId}/sections/${this.sectionId}`).update({
				cardCount: decrement
			})
	}
}
