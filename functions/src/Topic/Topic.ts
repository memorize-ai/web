import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Topic {
	static MAX_TOP_DECKS_LENGTH = 10
	
	id: string
	name: string
	topDecks: string[]
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.topDecks = snapshot.get('topDecks')
	}
	
	static fromId = (id: string): Promise<Topic> =>
		firestore.doc(`topics/${id}`).get().then(snapshot =>
			new Topic(snapshot)
		)
	
	documentReference = () =>
		firestore.doc(`topics/${this.id}`)
}
