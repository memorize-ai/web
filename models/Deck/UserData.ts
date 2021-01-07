import firebase from 'lib/firebase'

export interface DeckUserDataConstructor {
	dateAdded: Date
	isFavorite: boolean
	numberOfDueCards: number
	numberOfUnsectionedDueCards: number
	numberOfUnlockedCards: number
	sections: Record<string, number>
	rating: number | null
}

export default class DeckUserData implements DeckUserDataConstructor {
	dateAdded: Date
	isFavorite: boolean
	numberOfDueCards: number
	numberOfUnsectionedDueCards: number
	numberOfUnlockedCards: number
	sections: Record<string, number>
	rating: number | null

	constructor(data: DeckUserDataConstructor) {
		this.dateAdded = data.dateAdded
		this.isFavorite = data.isFavorite
		this.numberOfDueCards = data.numberOfDueCards
		this.numberOfUnsectionedDueCards = data.numberOfUnsectionedDueCards
		this.numberOfUnlockedCards = data.numberOfUnlockedCards
		this.sections = data.sections
		this.rating = data.rating
	}

	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new DeckUserData({
			dateAdded: snapshot.get('added')?.toDate() ?? new Date(),
			isFavorite: snapshot.get('favorite') ?? false,
			numberOfDueCards: snapshot.get('dueCardCount') ?? 0,
			numberOfUnsectionedDueCards: snapshot.get('unsectionedDueCardCount') ?? 0,
			numberOfUnlockedCards: snapshot.get('unlockedCardCount') ?? 0,
			sections: snapshot.get('sections') ?? {},
			rating: snapshot.get('rating') || null
		})

	get isDue() {
		return this.numberOfDueCards > 0
	}

	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.dateAdded = snapshot.get('added')?.toDate()
		this.isFavorite = snapshot.get('favorite') ?? false
		this.numberOfDueCards = snapshot.get('dueCardCount') ?? 0
		this.numberOfUnsectionedDueCards =
			snapshot.get('unsectionedDueCardCount') ?? 0
		this.numberOfUnlockedCards = snapshot.get('unlockedCardCount') ?? 0
		this.sections = snapshot.get('sections') ?? {}
		this.rating = snapshot.get('rating') || null

		return this
	}
}
