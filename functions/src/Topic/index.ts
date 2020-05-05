import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Topic {
	id: string
	name: string
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		if (!snapshot.exists)
			throw new Error(`There are no topics with ID "${snapshot.id}"`)
		
		this.id = snapshot.id
		this.name = snapshot.get('name')
	}
	
	get documentReference() {
		return firestore.doc(`topics/${this.id}`)
	}
	
	static fromId = async (id: string) =>
		new Topic(await firestore.doc(`topics/${id}`).get())
}
