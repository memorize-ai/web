import Section from './Section'
import firebase from '../firebase'

import 'firebase/firestore'

const firestore = firebase.firestore()

export interface DeckData {
	topics: string[]
	hasImage: boolean
	name: string
	subtitle: string
	description: string
	numberOfViews: number
	numberOfUniqueViews: number
	numberOfRatings: number
	numberOf1StarRatings: number
	numberOf2StarRatings: number
	numberOf3StarRatings: number
	numberOf4StarRatings: number
	numberOf5StarRatings: number
	averageRating: number
	numberOfDownloads: number
	numberOfCards: number
	numberOfUnsectionedCards: number
	numberOfCurrentUsers: number
	numberOfAllTimeUsers: number
	numberOfFavorites: number
	creatorId: string
	created: Date
	lastUpdated: Date
}

export interface CreateDeckData {
	name: string
	subtitle: string
	description: string
}

export default class Deck implements DeckData {
	id: string
	topics: string[]
	hasImage: boolean
	name: string
	subtitle: string
	description: string
	numberOfViews: number
	numberOfUniqueViews: number
	numberOfRatings: number
	numberOf1StarRatings: number
	numberOf2StarRatings: number
	numberOf3StarRatings: number
	numberOf4StarRatings: number
	numberOf5StarRatings: number
	averageRating: number
	numberOfDownloads: number
	numberOfCards: number
	numberOfUnsectionedCards: number
	numberOfCurrentUsers: number
	numberOfAllTimeUsers: number
	numberOfFavorites: number
	creatorId: string
	created: Date
	lastUpdated: Date
	
	isObservingSections: boolean = false
	sections: Section[] = []
	
	constructor(id: string, data: DeckData) {
		this.id = id
		this.topics = data.topics
		this.hasImage = data.hasImage
		this.name = data.name
		this.subtitle = data.subtitle
		this.description = data.description
		this.numberOfViews = data.numberOfViews
		this.numberOfUniqueViews = data.numberOfUniqueViews
		this.numberOfRatings = data.numberOfRatings
		this.numberOf1StarRatings = data.numberOf1StarRatings
		this.numberOf2StarRatings = data.numberOf2StarRatings
		this.numberOf3StarRatings = data.numberOf3StarRatings
		this.numberOf4StarRatings = data.numberOf4StarRatings
		this.numberOf5StarRatings = data.numberOf5StarRatings
		this.averageRating = data.averageRating
		this.numberOfDownloads = data.numberOfDownloads
		this.numberOfCards = data.numberOfCards
		this.numberOfUnsectionedCards = data.numberOfUnsectionedCards
		this.numberOfCurrentUsers = data.numberOfCurrentUsers
		this.numberOfAllTimeUsers = data.numberOfAllTimeUsers
		this.numberOfFavorites = data.numberOfFavorites
		this.creatorId = data.creatorId
		this.created = data.created
		this.lastUpdated = data.lastUpdated
	}
	
	get unsectionedSection() {
		return Section.newUnsectionedSection(this.numberOfUnsectionedCards)
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new Deck(snapshot.id, {
			topics: snapshot.get('topics'),
			hasImage: snapshot.get('hasImage'),
			name: snapshot.get('name'),
			subtitle: snapshot.get('subtitle'),
			description: snapshot.get('description'),
			numberOfViews: snapshot.get('viewCount'),
			numberOfUniqueViews: snapshot.get('uniqueViewCount'),
			numberOfRatings: snapshot.get('ratingCount'),
			numberOf1StarRatings: snapshot.get('1StarRatingCount'),
			numberOf2StarRatings: snapshot.get('2StarRatingCount'),
			numberOf3StarRatings: snapshot.get('3StarRatingCount'),
			numberOf4StarRatings: snapshot.get('4StarRatingCount'),
			numberOf5StarRatings: snapshot.get('5StarRatingCount'),
			averageRating: snapshot.get('averageRating'),
			numberOfDownloads: snapshot.get('downloadCount'),
			numberOfCards: snapshot.get('cardCount'),
			numberOfUnsectionedCards: snapshot.get('unsectionedCardCount'),
			numberOfCurrentUsers: snapshot.get('currentUserCount'),
			numberOfAllTimeUsers: snapshot.get('allTimeUserCount'),
			numberOfFavorites: snapshot.get('favoriteCount'),
			creatorId: snapshot.get('creator'),
			created: snapshot.get('created')?.toDate(),
			lastUpdated: snapshot.get('updated')?.toDate()
		})
	
	static observeForUserWithId = (
		uid: string,
		{ updateDeck, removeDeck }: {
			updateDeck: (snapshot: firebase.firestore.DocumentSnapshot) => void
			removeDeck: (id: string) => void
		}
	) =>
		firestore.collection(`users/${uid}/decks`).onSnapshot(
			snapshot => {
				for (const { type, doc: { id: deckId } } of snapshot.docChanges())
					switch (type) {
						case 'added':
							firestore.doc(`decks/${deckId}`).onSnapshot(
								updateDeck,
								error => {
									alert(error.message)
									console.error(error)
								}
							)
							break
						case 'removed':
							removeDeck(deckId)
							break
					}
			},
			error => {
				alert(error.message)
				console.error(error)
			}
		)
	
	static createForUserWithId = async (uid: string, data: CreateDeckData) => {
		const { id: deckId } = await firestore.collection('decks').add({
			...data,
			topics: [],
			hasImage: false,
			viewCount: 0,
			uniqueViewCount: 0,
			ratingCount: 0,
			'1StarRatingCount': 0,
			'2StarRatingCount': 0,
			'3StarRatingCount': 0,
			'4StarRatingCount': 0,
			'5StarRatingCount': 0,
			averageRating: 0,
			downloadCount: 0,
			cardCount: 0,
			unsectionedCardCount: 0,
			currentUserCount: 0,
			allTimeUserCount: 0,
			favoriteCount: 0,
			creator: uid,
			created: firebase.firestore.FieldValue.serverTimestamp(),
			updated: firebase.firestore.FieldValue.serverTimestamp()
		})
		
		await firestore.doc(`users/${uid}/decks/${deckId}`).set({
			added: firebase.firestore.FieldValue.serverTimestamp()
		})
		
		return deckId
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.topics = snapshot.get('topics')
		this.hasImage = snapshot.get('hasImage')
		this.name = snapshot.get('name')
		this.subtitle = snapshot.get('subtitle')
		this.description = snapshot.get('description')
		this.numberOfViews = snapshot.get('viewCount')
		this.numberOfUniqueViews = snapshot.get('uniqueViewCount')
		this.numberOfRatings = snapshot.get('ratingCount')
		this.numberOf1StarRatings = snapshot.get('1StarRatingCount')
		this.numberOf2StarRatings = snapshot.get('2StarRatingCount')
		this.numberOf3StarRatings = snapshot.get('3StarRatingCount')
		this.numberOf4StarRatings = snapshot.get('4StarRatingCount')
		this.numberOf5StarRatings = snapshot.get('5StarRatingCount')
		this.averageRating = snapshot.get('averageRating')
		this.numberOfDownloads = snapshot.get('downloadCount')
		this.numberOfCards = snapshot.get('cardCount')
		this.numberOfUnsectionedCards = snapshot.get('unsectionedCardCount')
		this.numberOfCurrentUsers = snapshot.get('currentUserCount')
		this.numberOfAllTimeUsers = snapshot.get('allTimeUserCount')
		this.numberOfFavorites = snapshot.get('favoriteCount')
		this.lastUpdated = snapshot.get('updated')?.toDate()
		
		return this
	}
	
	private sortSections = () =>
		this.sections = this.sections.sort(({ index: a }, { index: b }) => a - b)
	
	setIsObservingSections = (value: boolean) => {
		this.isObservingSections = value
		return this
	}
	
	addSection = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.sections.push(Section.fromSnapshot(snapshot))
		this.sortSections()
		
		return this
	}
	
	updateSection = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.sections.find(section => section.id === snapshot.id)?.updateFromSnapshot(snapshot)
		this.sortSections()
		
		return this
	}
	
	removeSection = (sectionId: string) => {
		this.sections = this.sections.filter(section => section.id !== sectionId)
		this.sortSections()
		
		return this
	}
}
