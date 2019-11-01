import * as admin from 'firebase-admin'

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
	
	compareTo = (deck: Deck): boolean =>
		true // TODO: Change this
}
