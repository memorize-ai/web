import UserData from './UserData'
import Section from '../Section'
import LoadingState from '../LoadingState'
import firebase from '../../firebase'

import 'firebase/firestore'
import 'firebase/storage'

const firestore = firebase.firestore()
const storage = firebase.storage().ref()

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
	creatorName: string | null
	created: Date
	lastUpdated: Date
}

export interface CreateDeckData {
	image: File | null
	name: string
	subtitle: string
	description: string
}

export default class Deck implements DeckData {
	static defaultImage = require('../../images/logos/icon.png')
	
	static isObserving: Record<string, boolean> = {} // Key is a user id
	static snapshotListeners: Record<string, () => void> = {}
	
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
	creatorName: string | null // Only available if the deck was retrieved from search
	created: Date
	lastUpdated: Date
	
	isObservingSections: boolean = false
	sections: Section[] = []
	
	userData: UserData | null
	
	constructor(id: string, data: DeckData, userData: UserData | null = null) {
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
		this.creatorName = data.creatorName
		this.created = data.created
		this.lastUpdated = data.lastUpdated
		
		this.userData = userData
	}
	
	get unsectionedSection() {
		return Section.newUnsectionedSection(this.numberOfUnsectionedCards)
	}
	
	static fromSnapshot = (
		snapshot: firebase.firestore.DocumentSnapshot,
		userData: UserData | null = null
	) =>
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
			creatorName: null,
			created: snapshot.get('created')?.toDate(),
			lastUpdated: snapshot.get('updated')?.toDate()
		}, userData)
	
	static addSnapshotListener = (id: string, value: () => void) =>
		Deck.snapshotListeners[id] = value
	
	static removeSnapshotListener = (id: string) => {
		const listener = Deck.snapshotListeners[id]
		listener && listener()
		
		delete Deck.snapshotListeners[id]
	}
	
	static observeForUserWithId = (
		uid: string,
		{ updateDeck, updateDeckUserData, removeDeck }: {
			updateDeck: (
				snapshot: firebase.firestore.DocumentSnapshot,
				userDataSnapshot: firebase.firestore.DocumentSnapshot
			) => void
			updateDeckUserData: (snapshot: firebase.firestore.DocumentSnapshot) => void
			removeDeck: (id: string) => void
		}
	) =>
		firestore.collection(`users/${uid}/decks`).onSnapshot(
			snapshot => {
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							Deck.addSnapshotListener(
								doc.id,
								firestore.doc(`decks/${doc.id}`).onSnapshot(
									snapshot => updateDeck(snapshot, doc),
									error => {
										alert(error.message)
										console.error(error)
									}
								)
							)
							break
						case 'modified':
							updateDeckUserData(doc)
							break
						case 'removed':
							Deck.removeSnapshotListener(doc.id)
							removeDeck(doc.id)
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
			topics: [],
			hasImage: Boolean(data.image),
			name: data.name,
			subtitle: data.subtitle,
			description: data.description,
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
		
		if (data.image)
			await storage.child(`/decks/${deckId}`).put(data.image, {
				contentType: data.image.type,
				customMetadata: { owner: uid }
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
	
	updateUserDataFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.userData?.updateFromSnapshot(snapshot) ?? (
			this.userData = UserData.fromSnapshot(snapshot)
		)
		return this
	}
	
	loadImageUrl = async (
		{ setImageUrl, setImageUrlLoadingState }: {
			setImageUrl: (deckId: string, url: string | null) => void
			setImageUrlLoadingState: (deckId: string, loadingState: LoadingState) => void
		}
	) => {
		try {
			setImageUrlLoadingState(this.id, LoadingState.Loading)
			
			setImageUrl(this.id, await storage.child(`decks/${this.id}`).getDownloadURL())
			setImageUrlLoadingState(this.id, LoadingState.Success)
		} catch (error) {
			setImageUrl(this.id, null)
			setImageUrlLoadingState(this.id, LoadingState.Fail)
			
			console.error(error)
		}
	}
	
	get = async (uid: string) => {
		const { docs } = await firestore
			.collection(`decks/${this.id}/sections`)
			.where('index', '==', 0)
			.get()
		
		const section: (
			firebase.firestore.DocumentSnapshot | undefined
		) = docs[0]
		
		const numberOfSectionedCards = section?.get('cardCount') ?? 0
		const numberOfUnlockedCards = this.numberOfUnsectionedCards + numberOfSectionedCards
		
		const data: Record<string, any> = {
			added: firebase.firestore.FieldValue.serverTimestamp(),
			dueCardCount: numberOfUnlockedCards,
			unsectionedDueCardCount: this.numberOfUnsectionedCards,
			unlockedCardCount: numberOfUnlockedCards
		}
		
		if (section)
			data.sections = { [section.id]: numberOfSectionedCards }
		
		return firestore.doc(`users/${uid}/decks/${this.id}`).set(data)
	}
	
	remove = (uid: string) =>
		firestore.doc(`users/${uid}/decks/${this.id}`).delete()
	
	isSectionUnlocked = (section: Section) =>
		section.isUnsectioned || (
			this.userData?.sections[section.id] !== undefined
		)
	
	unlockSectionForUserWithId = async (uid: string, section: Section) => {
		const { numberOfCards } = section
		
		await firestore.doc(`users/${uid}/decks/${this.id}`).update({
			dueCardCount: firebase.firestore.FieldValue.increment(numberOfCards),
			unlockedCardCount: firebase.firestore.FieldValue.increment(numberOfCards),
			[`sections.${section.id}`]: numberOfCards
		})
		
		return this
	}
	
	numberOfCardsDueForSection = (section: Section) =>
		this.userData?.sections[section.id] ?? 0
	
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
