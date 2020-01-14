import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Topic {
	static MAX_TOP_DECKS_LENGTH = 10
	
	id: string
	name: string
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
	}
	
	get documentReference() {
		return firestore.doc(`topics/${this.id}`)
	}
	
	static fromId = (id: string) =>
		firestore.doc(`topics/${id}`).get().then(snapshot =>
			new Topic(snapshot)
		)
}
