import * as admin from 'firebase-admin'

import decksClient, { DECKS_ENGINE_NAME } from '../AppSearch/decks'
import User from '../User'
import Card from '../Card'
import CardUserData from '../Card/UserData'
import Section from '../Section'

const firestore = admin.firestore()

export default class Deck {
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
	dateCreated: Date
	dateLastUpdated: Date
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
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
	
	static fromId = (id: string) =>
		firestore.doc(`decks/${id}`).get().then(snapshot =>
			new Deck(snapshot)
		)
	
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
	
	static currentUsers = (deckId: string) =>
		firestore.collection(`decks/${deckId}/currentUsers`).listDocuments().then(docs =>
			docs.map(({ id }) => id)
		)
	
	static numberOfDueCards = (deckId: string, cardUserData: CardUserData[], cache: Record<string, Deck>) => {
		const cachedDeck = cache[deckId]
		
		return cachedDeck
			? Promise.resolve(cachedDeck.numberOfDueCards(cardUserData))
			: Deck.fromId(deckId).then(deck =>
				(cache[deckId] = deck).numberOfDueCards(cardUserData)
			)
	}
	
	static addInitialCardsToUserNode = async (uid: string, deckId: string, sectionIds: string[]) => {
		const batch = firestore.batch()
		
		await firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', Section.unsectionedId)
			.get()
			.then(({ docs: cards }) =>
				cards.forEach(({ id: cardId }) =>
					batch.set(
						firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
						{ new: true, section: Section.unsectionedId }
					)
				)
			)
		
		for (const sectionId of sectionIds)
			await firestore
				.collection(`decks/${deckId}/cards`)
				.where('section', '==', sectionId)
				.get()
				.then(({ docs: cards }) =>
					cards.forEach(({ id: cardId }) =>
						batch.set(
							firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
							{ new: true, section: sectionId }
						)
					)
				)
		
		return batch.commit()
	}
	
	static addSectionToUserNode = (uid: string, deckId: string, sectionId: string) =>
		firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', sectionId)
			.get()
			.then(({ docs: cards }) => {
				const batch = firestore.batch()
				
				for (const { id: cardId } of cards)
					batch.set(
						firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`),
						{ new: true, section: sectionId }
					)
				
				return batch.commit()
			})
	
	static cardUserData = (
		uid: string,
		deckId: string,
		cache: Record<string, Card>
	) =>
		firestore.collection(`users/${uid}/decks/${deckId}/cards`).get().then(({ docs }) =>
			Promise.all(docs.map(async doc => {
				const cardId = doc.id
				
				const card = cache[cardId]
					?? await Card.fromId(cardId, deckId)
				
				if (!cache[cardId])
					cache[cardId] = card
				
				return {
					card,
					userData: new CardUserData(doc)
				}
			}))
		)
	
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
		
	numberOfDueCards = (cardUserData: CardUserData[]) =>
		cardUserData.reduce((acc, { isDue }) =>
			acc - (isDue ? 0 : 1)
		, this.numberOfCards)
	
	updateLastUpdated = () =>
		firestore.doc(`decks/${this.id}`).update({
			updated: admin.firestore.FieldValue.serverTimestamp()
		})
	
	static updateRating = (
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
		
		return documentReference.update(updateData)
			.then(() => Deck.fromId(deckId))
			.then(deck => deck.updateAverageRating())
	}
	
	static sectionIds = (deckId: string) =>
		firestore.collection(`decks/${deckId}/sections`).listDocuments().then(docs =>
			docs.map(({ id }) => id)
		)
	
	static delete = async (deckId: string) => {
		const currentUserIds = await Deck.currentUsers(deckId)
		const sectionIds = await Deck.sectionIds(deckId)
		
		const batch = firestore.batch()
		
		for (const uid of currentUserIds)
			batch.delete(firestore.doc(`users/${uid}/decks/${deckId}`))
		
		for (const sectionId of sectionIds)
			batch.delete(firestore.doc(`decks/${deckId}/sections/${sectionId}`))
		
		return batch.commit()
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
	
	index = () =>
		this.transformDataForIndexing().then(data =>
			decksClient.indexDocuments(DECKS_ENGINE_NAME, [data])
		)
	
	deleteIndex = () =>
		decksClient.destroyDocuments(DECKS_ENGINE_NAME, [this.id])
	
	private transformDataForIndexing = () =>
		User.fromId(this.creatorId).then(creator => ({
			id: this.id,
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
		}))
}
