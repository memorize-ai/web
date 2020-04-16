import * as admin from 'firebase-admin'

import Deck from '../Deck'
import Section from '../Section'

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
	
	static fromId = async (cardId: string, deckId: string) =>
		new Card(await firestore.doc(`decks/${deckId}/cards/${cardId}`).get())
	
	incrementDeckCardCount = Deck.incrementCardCount
	decrementDeckCardCount = Deck.decrementCardCount
	
	get isUnsectioned() {
		return this.sectionId === Section.unsectionedId
	}
	
	incrementSectionCardCount = (deckId: string, amount: number = 1) =>
		this.isUnsectioned
			? firestore.doc(`decks/${deckId}`).update({
				unsectionedCardCount: admin.firestore.FieldValue.increment(amount)
			})
			: firestore.doc(`decks/${deckId}/sections/${this.sectionId}`).update({
				cardCount: admin.firestore.FieldValue.increment(amount)
			})
	
	decrementSectionCardCount = (deckId: string, amount: number = 1) =>
		this.incrementSectionCardCount(deckId, -amount)
}
