import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Topic {
	id: string
	name: string
	category: string
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		if (!snapshot.exists)
			throw new Error(`There are no topics with ID "${snapshot.id}"`)
		
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.category = snapshot.get('category')
	}
	
	get documentReference() {
		return firestore.doc(`topics/${this.id}`)
	}
	
	static all = async () =>
		(await firestore.collection('topics').get())
			.docs
			.map(doc => new Topic(doc))
	
	static fromId = async (id: string) =>
		new Topic(await firestore.doc(`topics/${id}`).get())
	
	static fromName = async (name: string) => {
		const { empty, docs } = await firestore
			.collection('topics')
			.where('name', '==', name)
			.get()
		
		if (empty)
			throw new Error(`There are no topics with name "${name}"`)
		
		return new Topic(docs[0])
	}
	
	static fromCategory = async (category: string) => {
		const { docs } = await firestore
			.collection('topics')
			.where('category', '==', category)
			.get()
		
		return docs.map(doc => new Topic(doc))
	}
	
	get json() {
		return {
			id: this.id,
			name: this.name,
			category: this.category
		}
	}
}
