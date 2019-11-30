import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Section {
	id: string
	name: string
	numberOfCards: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.numberOfCards = snapshot.get('cardCount') || 0
	}
	
	static fromId = (sectionId: string, deckId: string): Promise<Section> =>
		firestore.doc(`decks/${deckId}/sections/${sectionId}`).get().then(snapshot =>
			new Section(snapshot)
		)
	
	deleteCards = (deckId: string): Promise<FirebaseFirestore.WriteResult[]> =>
		firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', this.id)
			.get()
			.then(({ docs }) =>
				Promise.all(docs.map(({ ref }) =>
					ref.delete()
				))
			)
}
