import * as admin from 'firebase-admin'
import Batch from 'firestore-batch'
import axios from 'axios'
import * as _ from 'lodash'

import decksClient from '../AppSearch/decks'
import User from '../User'
import Section from '../Section'
import { PRERENDER_TOKEN } from '../constants'

const firestore = admin.firestore()
const storage = admin.storage().bucket()

export default class Deck {
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
	dateCreated: Date
	dateLastUpdated: Date
	
	canPostCard: number
	nextPostedCardIndex: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		if (!snapshot.exists)
			throw new Error(`There are no decks with ID "${snapshot.id}"`)
		
		this.id = snapshot.id
		this.slugId = snapshot.get('slugId')
		this.slug = snapshot.get('slug')
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
		this.creatorId = snapshot.get('creator')
		this.dateCreated = snapshot.get('created')?.toDate()
		this.dateLastUpdated = snapshot.get('updated')?.toDate()
		
		this.canPostCard = snapshot.get('canPostCard') ?? false
		this.nextPostedCardIndex = snapshot.get('nextPostedCardIndex') ?? 0
	}
	
	get score() {
		return (
			this.numberOfViews +
			this.numberOfUniqueViews * 1.5 +
			this.numberOfRatings * 5 +
			this.averageRating * 15 +
			this.numberOfDownloads * 7.5 +
			this.numberOfCards / 2 +
			this.numberOfCurrentUsers * 5,
			this.numberOfFavorites * 2.5
		)
	}
	
	static fromId = async (id: string) =>
		new Deck(await firestore.doc(`decks/${id}`).get())
	
	static fromSlugId = async (slugId: string) => {
		const { empty, docs } = await firestore
			.collection('decks')
			.where('slugId', '==', slugId)
			.get()
		
		if (empty)
			throw new Error(`There are no decks with slugId "${slugId}"`)
		
		return new Deck(docs[0])
	}
	
	static decrementDueCardCount = (uid: string, deckId: string) =>
		firestore.doc(`users/${uid}/decks/${deckId}`).update({
			dueCardCount: admin.firestore.FieldValue.increment(-1)
		})
	
	static updateDueCardCount = (uid: string, deckId: string, dueCardCount: number) =>
		firestore.doc(`users/${uid}/decks/${deckId}`).update({ dueCardCount })
	
	static addUserToCurrentUsers = (deckId: string, uid: string) =>
		firestore.doc(`decks/${deckId}/currentUsers/${uid}`).set({})
	
	static removeUserFromCurrentUsers = (deckId: string, uid: string) =>
		firestore.doc(`decks/${deckId}/currentUsers/${uid}`).delete()
	
	static currentUsers = async (deckId: string) =>
		(await firestore.collection(`decks/${deckId}/currentUsers`).get())
			.docs
			.map(({ id }) => id)
	
	static addInitialCardsToUserNode = async (uid: string, deckId: string, sectionIds: string[]) => {
		const batch = new Batch(firestore)
		
		const { docs: unsectionedCards } = await firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', Section.unsectionedId)
			.get()
		
		for (const { id: cardId } of unsectionedCards)
			batch.set(
				firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
				{ new: true, section: Section.unsectionedId, due: new Date }
			)
		
		for (const sectionId of sectionIds) {
			const { docs: cards } = await firestore
				.collection(`decks/${deckId}/cards`)
				.where('section', '==', sectionId)
				.get()
			
			for (const { id: cardId } of cards)
				batch.set(
					firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
					{ new: true, section: sectionId, due: new Date }
				)
		}
		
		return batch.commit()
	}
	
	static addSectionToUserNode = async (uid: string, deckId: string, sectionId: string) => {
		const { docs: cards } = await firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', sectionId)
			.get()
		
		const batch = new Batch(firestore)
		
		for (const { id: cardId } of cards)
			batch.set(
				firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
				{ new: true, section: sectionId, due: new Date }
			)
		
		return batch.commit()
	}
	
	static incrementCardCount = (deckId: string, amount: number = 1) =>
		firestore.doc(`decks/${deckId}`).update({
			cardCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementCardCount = (deckId: string, amount: number = 1) =>
		Deck.incrementCardCount(deckId, -amount)
	
	static incrementUnsectionedCardCount = (deckId: string, amount: number = 1) =>
		firestore.doc(`decks/${deckId}`).update({
			unsectionedCardCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementUnsectionedCardCount = (deckId: string, amount: number = 1) =>
		Deck.incrementUnsectionedCardCount(deckId, -amount)
	
	static fieldNameForRating = (rating: number) =>
		`${rating}StarRatingCount`
	
	static incrementCurrentUserCount = (id: string, amount: number = 1) =>
		firestore.doc(`decks/${id}`).update({
			currentUserCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementCurrentUserCount = (id: string, amount: number = 1) =>
		Deck.incrementCurrentUserCount(id, -amount)
	
	static incrementAllTimeUserCount = (id: string, amount: number = 1) =>
		firestore.doc(`decks/${id}`).update({
			allTimeUserCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static incrementDownloadCount = (deckId: string) =>
		firestore.doc(`decks/${deckId}`).update({
			downloadCount: admin.firestore.FieldValue.increment(1)
		})
	
	updateLastUpdated = () => {
		this.dateLastUpdated = new Date
		
		return firestore.doc(`decks/${this.id}`).update({
			updated: admin.firestore.FieldValue.serverTimestamp()
		})
	}
	
	static updateRating = (
		uid: string,
		deckId: string,
		oldRating: number | undefined,
		newRating: number | undefined
	) => {
		if (oldRating === newRating)
			return Promise.resolve(null)
		
		const { FieldValue } = admin.firestore
		
		const documentReference = firestore.doc(`decks/${deckId}`)
		const updateData: FirebaseFirestore.UpdateData = {}
		
		oldRating
			? updateData[Deck.fieldNameForRating(oldRating)] = FieldValue.increment(-1)
			: updateData.ratingCount = FieldValue.increment(1)
		
		newRating
			? updateData[Deck.fieldNameForRating(newRating)] = FieldValue.increment(1)
			: updateData.ratingCount = FieldValue.increment(-1)
		
		return Promise.all([
			documentReference.update(updateData)
				.then(() => Deck.fromId(deckId))
				.then(deck => deck.updateAverageRating()),
			User.addXP(
				uid,
				(newRating === undefined ? 0 : (User.xp as Record<string, number>)[`rating_${newRating}`]) -
				(oldRating === undefined ? 0 : (User.xp as Record<string, number>)[`rating_${oldRating}`])
			)
		])
	}
	
	static sectionIds = async (deckId: string) =>
		(await firestore.collection(`decks/${deckId}/sections`).get())
			.docs
			.map(({ id }) => id)
	
	static delete = async (deckId: string) => {
		const currentUserIds = await Deck.currentUsers(deckId)
		const sectionIds = await Deck.sectionIds(deckId)
		
		const batch = new Batch(firestore)
		
		for (const uid of currentUserIds)
			batch.delete(firestore.doc(`users/${uid}/decks/${deckId}`))
		
		for (const sectionId of sectionIds)
			batch.delete(firestore.doc(`decks/${deckId}/sections/${sectionId}`))
		
		return batch.commit()
	}
	
	static deleteFromStorage = (deckId: string) =>
		Promise.all([
			storage.file(`decks/${deckId}`).delete(),
			storage.deleteFiles({ directory: `deck-assets/${deckId}` })
		])
	
	static incrementCounter = (amount: number = 1) =>
		firestore.doc('counters/decks').update({
			value: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementCounter = (amount: number = 1) =>
		Deck.incrementCounter(-amount)
	
	get url() {
		return `https://memorize.ai/d/${this.slugId}/${this.slug}`
	}
	
	updateAverageRating = () => {
		const sum = (
			this.numberOf1StarRatings +
			this.numberOf2StarRatings +
			this.numberOf3StarRatings +
			this.numberOf4StarRatings +
			this.numberOf5StarRatings
		)
		
		return firestore.doc(`decks/${this.id}`).update({
			averageRating: sum
				? (
					this.numberOf1StarRatings +
					this.numberOf2StarRatings * 2 +
					this.numberOf3StarRatings * 3 +
					this.numberOf4StarRatings * 4 +
					this.numberOf5StarRatings * 5
				) / sum
				: 0
		})
	}
	
	initializeNextPostedCard = () =>
		firestore.doc(`decks/${this.id}`).update({
			canPostCard: this.numberOfCards > 0,
			nextPostedCardIndex: 0
		})
	
	updateNextPostedCard = () =>
		firestore.doc(`decks/${this.id}`).update({
			canPostCard: this.numberOfCards > this.nextPostedCardIndex + 1,
			nextPostedCardIndex: admin.firestore.FieldValue.increment(1)
		})
	
	updateCanPostCard = () =>
		firestore.doc(`decks/${this.id}`).update({
			canPostCard: this.numberOfCards > this.nextPostedCardIndex
		})
	
	index = async () =>
		decksClient.createIndices(await this.transformDataForIndexing())
	
	deleteIndex = () =>
		decksClient.deleteIndices(this.id)
	
	cache = () =>
		axios.post('https://api.prerender.io/recache', {
			prerenderToken: PRERENDER_TOKEN,
			url: this.url
		})
	
	wasUpdatedByUser = (newDeck: Deck) => !(
		_.isEqual(this.topics, newDeck.topics) &&
		this.hasImage === newDeck.hasImage &&
		this.name === newDeck.name &&
		this.subtitle === newDeck.subtitle &&
		this.description === newDeck.description &&
		this.numberOfCards === newDeck.numberOfCards
	)
	
	shouldIndex = (newDeck: Deck) => !(
		this.slugId === newDeck.slugId &&
		this.slug === newDeck.slug &&
		_.isEqual(this.topics, newDeck.topics) &&
		this.hasImage === newDeck.hasImage &&
		this.name === newDeck.name &&
		this.subtitle === newDeck.subtitle &&
		this.description === newDeck.description &&
		this.numberOfRatings === newDeck.numberOfRatings &&
		this.averageRating === newDeck.averageRating &&
		this.numberOfCards === newDeck.numberOfCards &&
		this.numberOfCurrentUsers === newDeck.numberOfCurrentUsers &&
		this.creatorId === newDeck.creatorId &&
		this.score === newDeck.score
	)
	
	shouldCache = (newDeck: Deck) => !(
		this.slugId === newDeck.slugId &&
		this.slug === newDeck.slug &&
		_.isEqual(this.topics, newDeck.topics) &&
		this.hasImage === newDeck.hasImage &&
		this.name === newDeck.name &&
		this.subtitle === newDeck.subtitle &&
		this.description === newDeck.description &&
		this.numberOfRatings === newDeck.numberOfRatings &&
		this.averageRating === newDeck.averageRating &&
		this.numberOfCards === newDeck.numberOfCards &&
		this.numberOfDownloads === newDeck.numberOfDownloads &&
		this.numberOfCards === newDeck.numberOfCards &&
		this.numberOfUnsectionedCards === newDeck.numberOfUnsectionedCards &&
		this.numberOfCurrentUsers === newDeck.numberOfCurrentUsers &&
		this.creatorId === newDeck.creatorId
	)
	
	shouldUpdateCanPostCard = (newDeck: Deck) =>
		this.numberOfCards !== newDeck.numberOfCards
	
	private transformDataForIndexing = async () => {
		const creator = await User.fromId(this.creatorId)
		
		return {
			id: this.id,
			slug_id: this.slugId,
			slug: this.slug,
			score: this.score,
			topics: this.topics,
			has_image: this.hasImage,
			name: this.name,
			subtitle: this.subtitle,
			description: this.description,
			view_count: this.numberOfViews,
			unique_view_count: this.numberOfUniqueViews,
			rating_count: this.numberOfRatings,
			one_star_rating_count: this.numberOf1StarRatings,
			two_star_rating_count: this.numberOf2StarRatings,
			three_star_rating_count: this.numberOf3StarRatings,
			four_star_rating_count: this.numberOf4StarRatings,
			five_star_rating_count: this.numberOf5StarRatings,
			average_rating: this.averageRating,
			download_count: this.numberOfDownloads,
			card_count: this.numberOfCards,
			unsectioned_card_count: this.numberOfUnsectionedCards,
			current_user_count: this.numberOfCurrentUsers,
			all_time_user_count: this.numberOfAllTimeUsers,
			favorite_count: this.numberOfFavorites,
			creator_id: this.creatorId,
			creator_name: creator.name,
			created: this.dateCreated,
			updated: this.dateLastUpdated
		}
	}
	
	toJSON = () => ({
		id: this.id,
		slug_id: this.slugId,
		slug: this.slug,
		topics: this.topics,
		has_image: this.hasImage,
		name: this.name,
		subtitle: this.subtitle,
		description: this.description,
		ratings: {
			average: this.averageRating,
			total: this.numberOfRatings,
			individual: [
				this.numberOf1StarRatings,
				this.numberOf2StarRatings,
				this.numberOf3StarRatings,
				this.numberOf4StarRatings,
				this.numberOf5StarRatings
			]
		},
		downloads: this.numberOfDownloads,
		cards: this.numberOfCards,
		unsectioned_cards: this.numberOfUnsectionedCards,
		current_users: this.numberOfCurrentUsers,
		all_time_users: this.numberOfAllTimeUsers,
		favorites: this.numberOfFavorites,
		creator_id: this.creatorId,
		date_created: this.dateCreated.getTime(),
		date_last_updated: this.dateLastUpdated.getTime()
	})
}
