import * as admin from 'firebase-admin'

import Deck from '../Deck'

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
	
	get documentReference() {
		return firestore.doc(`topics/${this.id}`)
	}
	
	static fromId = (id: string): Promise<Topic> =>
		firestore.doc(`topics/${id}`).get().then(snapshot =>
			new Topic(snapshot)
		)
	
	getTopDecks = (): Promise<Deck[]> =>
		Promise.all(this.topDecks.map(Deck.fromId))
}
