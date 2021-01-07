import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import { nanoid } from 'nanoid'

import Search, { DeckSortAlgorithm as SortAlgorithm } from './Search'
import UserData from './UserData'
import Section from 'models/Section'
import SnapshotLike from 'models/SnapshotLike'
import LoadingState from 'models/LoadingState'
import { DisqusProps } from 'components/Disqus'
import { slugify, handleError } from 'lib/utils'
import { BASE_URL } from 'lib/constants'
import firebase from 'lib/firebase'

import 'firebase/firestore'
import 'firebase/storage'

const firestore = firebase.firestore()
const storage = firebase.storage().ref()

export interface DeckData {
	id: string
	slugId: string
	slug: string
	topics: string[]
	image: boolean
	name: string
	subtitle: string
	description: string
	views: number
	uniqueViews: number
	ratings: number
	'1StarRatings': number
	'2StarRatings': number
	'3StarRatings': number
	'4StarRatings': number
	'5StarRatings': number
	averageRating: number
	downloads: number
	cards: number
	unsectionedCards: number
	currentUsers: number
	allTimeUsers: number
	favorites: number
	creatorId: string
	creatorName: string | null
	created: number
	updated: number
}

export interface CreateDeckData {
	image: File | null
	name: string
	subtitle: string
	description: string
	topics: string[]
}

export default class Deck {
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
	unsectionedSection: Section

	constructor(data: DeckData, userData: UserData | null = null) {
		this.id = data.id
		this.slugId = data.slugId
		this.slug = data.slug
		this.topics = data.topics
		this.hasImage = data.image
		this.name = data.name
		this.subtitle = data.subtitle
		this.description = data.description
		this.numberOfViews = data.views
		this.numberOfUniqueViews = data.uniqueViews
		this.numberOfRatings = data.ratings
		this.numberOf1StarRatings = data['1StarRatings']
		this.numberOf2StarRatings = data['2StarRatings']
		this.numberOf3StarRatings = data['3StarRatings']
		this.numberOf4StarRatings = data['4StarRatings']
		this.numberOf5StarRatings = data['5StarRatings']
		this.averageRating = data.averageRating
		this.numberOfDownloads = data.downloads
		this.numberOfCards = data.cards
		this.numberOfUnsectionedCards = data.unsectionedCards
		this.numberOfCurrentUsers = data.currentUsers
		this.numberOfAllTimeUsers = data.allTimeUsers
		this.numberOfFavorites = data.favorites
		this.creatorId = data.creatorId
		this.creatorName = data.creatorName
		this.created = new Date(data.created)
		this.lastUpdated = new Date(data.updated)

		this.userData = userData
		this.unsectionedSection = Section.newUnsectionedSection(
			this.numberOfUnsectionedCards
		)
	}

	static fromSnapshot = (
		snapshot: SnapshotLike,
		userData: UserData | null = null
	) => new Deck(Deck.dataFromSnapshot(snapshot), userData)

	static dataFromSnapshot = (snapshot: SnapshotLike): DeckData => ({
		id: snapshot.id,
		slugId: snapshot.get('slugId') ?? '...',
		slug: snapshot.get('slug') ?? '...',
		topics: snapshot.get('topics') ?? [],
		image: snapshot.get('hasImage') ?? false,
		name: snapshot.get('name') ?? '(error)',
		subtitle: snapshot.get('subtitle') ?? '(error)',
		description: snapshot.get('description') ?? '(error)',
		views: snapshot.get('viewCount') ?? 0,
		uniqueViews: snapshot.get('uniqueViewCount') ?? 0,
		ratings: snapshot.get('ratingCount') ?? 0,
		'1StarRatings': snapshot.get('1StarRatingCount') ?? 0,
		'2StarRatings': snapshot.get('2StarRatingCount') ?? 0,
		'3StarRatings': snapshot.get('3StarRatingCount') ?? 0,
		'4StarRatings': snapshot.get('4StarRatingCount') ?? 0,
		'5StarRatings': snapshot.get('5StarRatingCount') ?? 0,
		averageRating: snapshot.get('averageRating') ?? 0,
		downloads: snapshot.get('downloadCount') ?? 0,
		cards: snapshot.get('cardCount') ?? 0,
		unsectionedCards: snapshot.get('unsectionedCardCount') ?? 0,
		currentUsers: snapshot.get('currentUserCount') ?? 0,
		allTimeUsers: snapshot.get('allTimeUserCount') ?? 0,
		favorites: snapshot.get('favoriteCount') ?? 0,
		creatorId: snapshot.get('creator') ?? '...',
		creatorName: null,
		created: snapshot.get('created')?.toMillis() ?? Date.now(),
		updated: snapshot.get('updated')?.toMillis() ?? Date.now()
	})

	static addSnapshotListener = (id: string, value: () => void) =>
		(Deck.snapshotListeners[id] = value)

	static removeSnapshotListener = (id: string) => {
		Deck.snapshotListeners[id]?.()
		delete Deck.snapshotListeners[id]
	}

	static observeForUserWithId = (
		uid: string,
		{
			setLoadingState,
			updateDeck,
			updateDeckUserData,
			removeDeck
		}: {
			setLoadingState: (loadingState: LoadingState) => void
			updateDeck: (
				snapshot: firebase.firestore.DocumentSnapshot,
				userDataSnapshot: firebase.firestore.DocumentSnapshot
			) => void
			updateDeckUserData: (
				snapshot: firebase.firestore.DocumentSnapshot
			) => void
			removeDeck: (id: string) => void
		}
	) => {
		setLoadingState(LoadingState.Loading)

		firestore.collection(`users/${uid}/decks`).onSnapshot(
			snapshot => {
				const changes = snapshot.docChanges()

				if (!changes.length) return setLoadingState(LoadingState.Success)

				let pendingAdded = 0

				const updatePendingAdded = (amount: 1 | -1) => {
					pendingAdded += amount

					if (pendingAdded <= 0) setLoadingState(LoadingState.Success)
				}

				for (const { type, doc } of changes)
					switch (type) {
						case 'added':
							updatePendingAdded(1)

							Deck.addSnapshotListener(
								doc.id,
								firestore.doc(`decks/${doc.id}`).onSnapshot(snapshot => {
									updateDeck(snapshot, doc)
									updatePendingAdded(-1)
								}, handleError)
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

	get printUrl() {
		return `/print/${this.slugId}/${encodeURIComponent(this.slug)}`
	}

	get urlWithOrigin() {
		return `${BASE_URL}${this.url}`
	}

	get imageUrl() {
		return this.hasImage
			? `https://firebasestorage.googleapis.com/v0/b/memorize-ai.appspot.com/o/decks%2F${this.id}?alt=media`
			: null
	}

	get worstRating() {
		for (const rating of [1, 2, 3, 4, 5])
			if (this[`numberOf${rating}StarRatings`] > 0) return rating

		return 0
	}

	get bestRating() {
		for (const rating of [5, 4, 3, 2, 1])
			if (this[`numberOf${rating}StarRatings`] > 0) return rating

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

		this.unsectionedSection.numberOfCards = this.numberOfUnsectionedCards

		return this
	}

	updateUserDataFromSnapshot = (
		snapshot: firebase.firestore.DocumentSnapshot
	) => {
		this.userData?.updateFromSnapshot(snapshot) ??
			(this.userData = UserData.fromSnapshot(snapshot))
		return this
	}

	get = async (uid: string) => {
		const { docs } = await firestore
			.collection(`decks/${this.id}/sections`)
			.where('index', '==', 0)
			.get()

		const section: firebase.firestore.DocumentSnapshot | undefined = docs[0]

		const numberOfSectionedCards = section?.get('cardCount') ?? 0
		const numberOfUnlockedCards =
			this.numberOfUnsectionedCards + numberOfSectionedCards

		const data: Record<string, unknown> = {
			added: firebase.firestore.FieldValue.serverTimestamp(),
			dueCardCount: numberOfUnlockedCards,
			unsectionedDueCardCount: this.numberOfUnsectionedCards,
			unlockedCardCount: numberOfUnlockedCards
		}

		if (section) data.sections = { [section.id]: numberOfSectionedCards }

		return firestore.doc(`users/${uid}/decks/${this.id}`).set(data)
	}

	remove = (uid: string) =>
		firestore.doc(`users/${uid}/decks/${this.id}`).delete()

	isSectionUnlocked = (section: Section) =>
		section.isUnsectioned || this.userData?.sections[section.id] !== undefined

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
		(section.isUnsectioned
			? this.userData?.numberOfUnsectionedDueCards
			: this.userData?.sections[section.id]) ?? 0

	countForRating = (rating: 1 | 2 | 3 | 4 | 5): number =>
		this[`numberOf${rating}StarRatings`]

	rate = (uid: string, rating: 1 | 2 | 3 | 4 | 5 | null) =>
		firestore.doc(`users/${uid}/decks/${this.id}`).update({
			rating: rating ?? firebase.firestore.FieldValue.delete()
		})

	loadSimilarDecks = async (chunkSize: number) => {
		const chunks = await Promise.all([
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
			...(this.name
				.split(/\s+/)
				.map(word => {
					const trimmed = word.trim()

					return trimmed && !Deck.USELESS_WORDS_REGEX.test(trimmed)
						? Search.search(trimmed, {
								pageNumber: 1,
								pageSize: chunkSize / 2,
								sortAlgorithm: SortAlgorithm.Top,
								filterForTopics: null
						  })
						: null
				})
				.filter(Boolean) as Promise<Deck[]>[])
		])

		return uniqBy(flatten(chunks), 'id').filter(deck => deck.id !== this.id)
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
			batch.update(firestore.doc(`decks/${this.id}/sections/${sectionId}`), {
				index: i
			})
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
		{
			image,
			name,
			subtitle,
			description,
			topics
		}: {
			image: File | null | undefined
			name: string
			subtitle: string
			description: string
			topics: string[]
		}
	) => {
		const storageChild =
			image === undefined ? undefined : storage.child(`/decks/${this.id}`)

		const updateData: Record<string, unknown> = {
			topics,
			name,
			subtitle,
			description
		}

		if (storageChild) updateData.hasImage = image !== null

		const promises: PromiseLike<unknown>[] = [
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

		return Promise.all(promises)
	}

	delete = (uid: string) => {
		if (this.creatorId !== uid) return

		const batch = firestore.batch()

		batch.delete(firestore.doc(`decks/${this.id}`))
		batch.delete(firestore.doc(`users/${uid}/decks/${this.id}`))

		return batch.commit()
	}

	uploadUrl = (uid: string) =>
		`/_api/upload-deck-asset?user=${uid}&deck=${this.id}`

	reviewUrl = (section?: Section) =>
		`/review/${this.slugId}/${this.slug}${
			section ? `/${section.isUnsectioned ? 'unsectioned' : section.id}` : ''
		}`

	cramUrl = (section?: Section) =>
		`/cram/${this.slugId}/${this.slug}${
			section ? `/${section.isUnsectioned ? 'unsectioned' : section.id}` : ''
		}`
}
