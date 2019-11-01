import * as admin from 'firebase-admin'

import Topic from '../Topic/Topic'

const firestore = admin.firestore()

export default class Deck {
	id: string
	topics: string[]
	name: string
	subtitle: string
	numberOfViews: number
	numberOfUniqueViews: number
	numberOfRatings: number
	averageRating: number
	numberOfDownloads: number
	dateCreated: Date
	dateLastUpdated: Date
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.topics = snapshot.get('topics')
		this.name = snapshot.get('name')
		this.subtitle = snapshot.get('subtitle')
		this.numberOfViews = snapshot.get('viewCount')
		this.numberOfUniqueViews = snapshot.get('uniqueViewCount')
		this.numberOfRatings = snapshot.get('ratingCount')
		this.averageRating = snapshot.get('averageRating')
		this.numberOfDownloads = snapshot.get('downloadCount')
		this.dateCreated = snapshot.get('created').toDate()
		this.dateLastUpdated = snapshot.get('updated').toDate()
	}
	
	static fromId = (id: string): Promise<Deck> =>
		firestore.doc(`decks/${id}`).get().then(snapshot =>
			new Deck(snapshot)
		)
	
	getTopics = (): Promise<Topic[]> =>
		Promise.all(this.topics.map(Topic.fromId))
	
	insertIntoTopDecks = (): Promise<void> =>
		this.getTopics().then(topics =>
			Promise.all(topics.map(topic =>
				topic.getTopDecks().then(topDecks => {
					for (const i of [...topDecks.keys()])
						if (this.compareTo(topDecks[i])) {
							topDecks.splice(i, 0, this).slice(0, Topic.MAX_TOP_DECKS_LENGTH)
							return topic.documentReference().update({ topDecks })
						}
					return Promise.resolve(null)
				})	
			))
		) as Promise<void>
	
	compareTo = (deck: Deck): boolean =>
		true // TODO: Change this
}
