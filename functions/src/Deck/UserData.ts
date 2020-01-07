import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class DeckUserData {
	id: string
	dateAdded: Date
	isFavorite: boolean
	numberOfDueCards: number
	rating: null | 1 | 2 | 3 | 4 | 5
	sections: Record<string, number>
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.dateAdded = snapshot.get('added')?.toDate()
		this.isFavorite = snapshot.get('favorite') ?? false
		this.numberOfDueCards = snapshot.get('dueCardCount') ?? 0
		this.rating = snapshot.get('rating') ?? null
		this.sections = snapshot.get('sections') ?? {}
	}
	
	static fromId = (uid: string, deckId: string): Promise<DeckUserData> =>
		firestore.doc(`users/${uid}/decks/${deckId}`).get().then(deck =>
			new DeckUserData(deck)
		)
	
	isSectionUnlocked = (sectionId: string): boolean =>
		this.sections[sectionId] !== undefined
}
