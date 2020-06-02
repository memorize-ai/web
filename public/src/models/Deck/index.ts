import _ from 'lodash'
import { nanoid } from 'nanoid'

import Search, { DeckSortAlgorithm as SortAlgorithm } from './Search'
import UserData from './UserData'
import Section from '../Section'
import LoadingState from '../LoadingState'
import { DisqusProps } from '../../components/shared/Disqus'
import { slugify, handleError } from '../../utils'
import firebase from '../../firebase'

import 'firebase/firestore'
import 'firebase/storage'

const firestore = firebase.firestore()
const storage = firebase.storage().ref()

export interface DeckData {
	slugId: string
	slug: string
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
	topics: string[]
}

export default class Deck implements DeckData {
	static DEFAULT_IMAGE_URL: string = require('../../images/logos/icon.webp')
	static USELESS_WORDS_REGEX = /^(.|from|to|and|by|at|why|in)$/i
	static SLUG_ID_LENGTH = 10
	
	/** Key is a user ID */
	static isObservingOwned: Record<string, boolean> = {}
	
	/** Key is a deck slug ID */
	static isObserving: Record<string, boolean> = {}
	
	/** Key is a deck ID */
	static similarDeckObservers: Record<string, boolean> = {}
	
	/** Key is a deck ID */
	static snapshotListeners: Record<string, () => void> = {}
	
	id: string
	slugId: string
	slug: string
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
	/** Only available if the deck was retrieved from search */
	creatorName: string | null
	created: Date
	lastUpdated: Date
	
	userData: UserData | null
	
	constructor(id: string, data: DeckData, userData: UserData | null = null) {
		this.id = id
		this.slugId = data.slugId
		this.slug = data.slug
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
			slugId: snapshot.get('slugId') ?? '...',
			slug: snapshot.get('slug') ?? '...',
			topics: snapshot.get('topics') ?? [],
			hasImage: snapshot.get('hasImage') ?? false,
			name: snapshot.get('name') ?? '(error)',
			subtitle: snapshot.get('subtitle') ?? '(error)',
			description: snapshot.get('description') ?? '(error)',
			numberOfViews: snapshot.get('viewCount') ?? 0,
			numberOfUniqueViews: snapshot.get('uniqueViewCount') ?? 0,
			numberOfRatings: snapshot.get('ratingCount') ?? 0,
			numberOf1StarRatings: snapshot.get('1StarRatingCount') ?? 0,
			numberOf2StarRatings: snapshot.get('2StarRatingCount') ?? 0,
			numberOf3StarRatings: snapshot.get('3StarRatingCount') ?? 0,
			numberOf4StarRatings: snapshot.get('4StarRatingCount') ?? 0,
			numberOf5StarRatings: snapshot.get('5StarRatingCount') ?? 0,
			averageRating: snapshot.get('averageRating') ?? 0,
			numberOfDownloads: snapshot.get('downloadCount') ?? 0,
			numberOfCards: snapshot.get('cardCount') ?? 0,
			numberOfUnsectionedCards: snapshot.get('unsectionedCardCount') ?? 0,
			numberOfCurrentUsers: snapshot.get('currentUserCount') ?? 0,
			numberOfAllTimeUsers: snapshot.get('allTimeUserCount') ?? 0,
			numberOfFavorites: snapshot.get('favoriteCount') ?? 0,
			creatorId: snapshot.get('creator') ?? '...',
			creatorName: null,
			created: snapshot.get('created')?.toDate() ?? new Date(),
			lastUpdated: snapshot.get('updated')?.toDate() ?? new Date()
		}, userData)
	
	static addSnapshotListener = (id: string, value: () => void) =>
		Deck.snapshotListeners[id] = value
	
	static removeSnapshotListener = (id: string) => {
		Deck.snapshotListeners[id]?.()
		delete Deck.snapshotListeners[id]
	}
	
	static observeForUserWithId = (
		uid: string,
		{ setLoadingState, updateDeck, updateDeckUserData, removeDeck }: {
			setLoadingState: (loadingState: LoadingState) => void
			updateDeck: (
				snapshot: firebase.firestore.DocumentSnapshot,
				userDataSnapshot: firebase.firestore.DocumentSnapshot
			) => void
			updateDeckUserData: (snapshot: firebase.firestore.DocumentSnapshot) => void
			removeDeck: (id: string) => void
		}
	) => {
		setLoadingState(LoadingState.Loading)
		
		firestore.collection(`users/${uid}/decks`).onSnapshot(
			snapshot => {
				const changes = snapshot.docChanges()
				
				if (!changes.length)
					return setLoadingState(LoadingState.Success)
				
				let pendingAdded = 0
				
				const updatePendingAdded = (amount: 1 | -1) => {
					pendingAdded += amount
					
					if (pendingAdded <= 0)
						setLoadingState(LoadingState.Success)
				}
				
				for (const { type, doc } of changes)
					switch (type) {
						case 'added':
							updatePendingAdded(1)
							
							Deck.addSnapshotListener(
								doc.id,
								firestore.doc(`decks/${doc.id}`).onSnapshot(
									snapshot => {
										updateDeck(snapshot, doc)
										updatePendingAdded(-1)
									},
									handleError
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
				setLoadingState(LoadingState.Fail)
				handleError(error)
			}
		)
	}
	
	static createSlug = (name: string) => ({
		slugId: nanoid(Deck.SLUG_ID_LENGTH),
		slug: slugify(name)
	})
	
	/** @returns The deck's slug */
	static createForUserWithId = async (uid: string, data: CreateDeckData) => {
		const doc = firestore.collection('decks').doc()
		const deckId = doc.id
		const slugParts = Deck.createSlug(data.name)
		
		await doc.set({
			...slugParts,
			topics: data.topics,
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
		
		return slugParts
	}
	
	get url() {
		return `/d/${this.slugId}/${encodeURIComponent(this.slug)}`
	}
	
	get urlWithOrigin() {
		return `https://memorize.ai${this.url}`
	}
	
	get imageUrl() {
		return this.hasImage
			? `https://firebasestorage.googleapis.com/v0/b/memorize-ai.appspot.com/o/decks%2F${this.id}?alt=media`
			: null
	}
	
	get worstRating() {
		for (const rating of [1, 2, 3, 4, 5])
			if ((this as any)[`numberOf${rating}StarRatings`] > 0)
				return rating
		
		return 0
	}
	
	get bestRating() {
		for (const rating of [5, 4, 3, 2, 1])
			if ((this as any)[`numberOf${rating}StarRatings`] > 0)
				return rating
		
		return 0
	}
	
	get disqusProps(): DisqusProps {
		return {
			url: this.urlWithOrigin,
			id: this.id,
			title: this.name
		}
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
	
	countForRating = (rating: 1 | 2 | 3 | 4 | 5): number =>
		(this as any)[`numberOf${rating}StarRatings`]
	
	rate = (uid: string, rating: 1 | 2 | 3 | 4 | 5 | null) =>
		firestore.doc(`users/${uid}/decks/${this.id}`).update({
			rating: rating ?? firebase.firestore.FieldValue.delete()
		})
	
	loadSimilarDecks = async (chunkSize: number) => {
		const chunks: Deck[][] = await Promise.all([
			Search.search(this.name, {
				pageNumber: 1,
				pageSize: chunkSize,
				sortAlgorithm: SortAlgorithm.Top,
				filterForTopics: null
			}),
			Search.search(null, {
				pageNumber: 1,
				pageSize: chunkSize,
				sortAlgorithm: SortAlgorithm.Top,
				filterForTopics: this.topics
			}),
			..._.without(
				this.name.split(/\s+/).map(word => {
					const trimmed = word.trim()
					
					return trimmed && !Deck.USELESS_WORDS_REGEX.test(trimmed)
						? Search.search(trimmed, {
							pageNumber: 1,
							pageSize: chunkSize / 2,
							sortAlgorithm: SortAlgorithm.Top,
							filterForTopics: null
						})
						: null
				}),
				null
			)
		]) as any[][]
		
		return _.uniqBy(_.flatten(chunks), 'id')
			.filter(deck => deck.id !== this.id)
	}
	
	toggleFavorite = (uid: string) =>
		firestore.doc(`users/${uid}/decks/${this.id}`).update({
			favorite: !this.userData?.isFavorite
		})
	
	reorderSection = (sections: Section[], section: Section, delta: number) => {
		const sectionIds = sections.map(({ id }) => id)
		
		sectionIds.splice(section.index, 1)
		sectionIds.splice(section.index + delta, 0, section.id)
		
		const batch = firestore.batch()
		
		sectionIds.forEach((sectionId, i) =>
			batch.update(
				firestore.doc(`decks/${this.id}/sections/${sectionId}`),
				{ index: i }
			)
		)
		
		return batch.commit()
	}
	
	/**
	 * - `image = File`: Update image
	 * - `image = null`: Remove image
	 * - `image = undefined`: Do nothing
	 */
	edit = async (
		uid: string,
		{ image, name, subtitle, description, topics }: {
			image: File | null | undefined
			name: string
			subtitle: string
			description: string
			topics: string[]
		}
	) => {
		const storageChild = image === undefined
			? undefined
			: storage.child(`/decks/${this.id}`)
		
		const updateData: Record<string, any> = {
			topics,
			name,
			subtitle,
			description
		}
		
		if (storageChild)
			updateData.hasImage = image !== null
		
		const promises: PromiseLike<any>[] = [
			firestore.doc(`decks/${this.id}`).update(updateData)
		]
		
		if (storageChild)
			promises.push(
				image
					? storageChild.put(image, {
						contentType: image.type,
						customMetadata: { owner: uid }
					})
					: storageChild.delete()
			)
		
		await Promise.all(promises)
		
		return image && await storageChild!.getDownloadURL()
	}
	
	delete = (uid: string) => {
		if (this.creatorId !== uid)
			return
		
		const batch = firestore.batch()
		
		batch.delete(firestore.doc(`decks/${this.id}`))
		batch.delete(firestore.doc(`users/${uid}/decks/${this.id}`))
		
		return batch.commit()
	}
	
	uploadUrl = (uid: string) =>
		`https://memorize.ai/_api/upload-deck-asset?user=${uid}&deck=${this.id}`
}
