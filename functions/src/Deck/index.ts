import * as admin from 'firebase-admin'

import decksClient, { DECKS_ENGINE_NAME } from '../AppSearch/decks'
import User from '../User'

const firestore = admin.firestore()

export default class Deck {
	id: string
	topics: string[]
	hasImage: boolean
	name: string
	subtitle: string
	numberOfViews: number
	numberOfUniqueViews: number
	numberOfRatings: number
	averageRating: number
	numberOfDownloads: number
	creatorId: string
	dateCreated: Date
	dateLastUpdated: Date
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.topics = snapshot.get('topics')
		this.hasImage = snapshot.get('hasImage')
		this.name = snapshot.get('name')
		this.subtitle = snapshot.get('subtitle')
		this.numberOfViews = snapshot.get('viewCount')
		this.numberOfUniqueViews = snapshot.get('uniqueViewCount')
		this.numberOfRatings = snapshot.get('ratingCount')
		this.averageRating = snapshot.get('averageRating')
		this.numberOfDownloads = snapshot.get('downloadCount')
		this.creatorId = snapshot.get('creator')
		this.dateCreated = snapshot.get('created').toDate()
		this.dateLastUpdated = snapshot.get('updated').toDate()
	}
	
	get score() {
		return (
			this.numberOfViews +
			this.numberOfUniqueViews * 1.5 +
			this.numberOfRatings * 5 +
			this.averageRating * 15 +
			this.numberOfDownloads * 7.5
		)
	}
	
	static fromId = (id: string): Promise<Deck> =>
		firestore.doc(`decks/${id}`).get().then(snapshot =>
			new Deck(snapshot)
		)
	
	index = (): Promise<void> =>
		this.transformDataForIndexing().then(data =>
			decksClient.indexDocuments(DECKS_ENGINE_NAME, [data])
		)
	
	deleteIndex = (): Promise<void> =>
		decksClient.destroyDocuments(DECKS_ENGINE_NAME, [this.id])
	
	private transformDataForIndexing = (): Promise<object> =>
		User.fromId(this.creatorId).then(creator => ({
			id: this.id,
			score: this.score,
			topics: this.topics,
			has_image: this.hasImage,
			name: this.name,
			subtitle: this.subtitle,
			view_count: this.numberOfViews,
			unique_view_count: this.numberOfUniqueViews,
			rating_count: this.numberOfRatings,
			average_rating: this.averageRating,
			download_count: this.numberOfDownloads,
			creator_id: this.creatorId,
			creator_name: creator.name,
			created: this.dateCreated,
			updated: this.dateLastUpdated
		}))
}
