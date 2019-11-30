import * as admin from 'firebase-admin'

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
		this.numberOfViews = snapshot.get('viewCount') || 0
		this.numberOfSkips = snapshot.get('skipCount') || 0
	}
	
	static fromId = (cardId: string, deckId: string): Promise<Card> =>
		firestore.doc(`decks/${deckId}/cards/${cardId}`).get().then(snapshot =>
			new Card(snapshot)
		)
	
	incrementSectionCardCount = (deckId: string): Promise<FirebaseFirestore.WriteResult> =>
		firestore.doc(`decks/${deckId}/sections/${this.sectionId}`).update({
			cardCount: admin.firestore.FieldValue.increment(1)
		})
	
	decrementSectionCardCount = (deckId: string): Promise<FirebaseFirestore.WriteResult> =>
		firestore.doc(`decks/${deckId}/sections/${this.sectionId}`).update({
			cardCount: admin.firestore.FieldValue.increment(-1)
		})
}
