import * as admin from 'firebase-admin'

const auth = admin.auth()
const firestore = admin.firestore()

export default class User {
	static xp = {
		deckDownload: 1,
		reviewCard: 1,
		
		rating_1: -5,
		rating_2: -2,
		rating_3: 1,
		rating_4: 4,
		rating_5: 10
	}
	
	id: string
	name: string
	email: string
	numberOfDecks: number
	interests: string[]
	allDecks: string[]
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.email = snapshot.get('email')
		this.numberOfDecks = snapshot.get('deckCount') ?? 0
		this.interests = snapshot.get('topics') ?? []
		this.allDecks = snapshot.get('allDecks') ?? []
	}
	
	static fromId = async (id: string) =>
		new User(await firestore.doc(`users/${id}`).get())
	
	static incrementDeckCount = (uid: string, amount: number = 1) =>
		firestore.doc(`users/${uid}`).update({
			deckCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementDeckCount = (uid: string, amount: number = 1) =>
		User.incrementDeckCount(uid, -amount)
	
	static addXP = (uid: string, amount: number = 1) =>
		firestore.doc(`users/${uid}`).update({
			xp: admin.firestore.FieldValue.increment(amount)
		})
	
	static subtractXP = (uid: string, amount: number = 1) =>
		User.addXP(uid, -amount)
	
	addDeckToAllDecks = (deckId: string) =>
		firestore.doc(`users/${this.id}`).update({
			allDecks: admin.firestore.FieldValue.arrayUnion(deckId)
		})
	
	removeDeckFromAllDecks = (deckId: string) =>
		firestore.doc(`users/${this.id}`).update({
			allDecks: admin.firestore.FieldValue.arrayRemove(deckId)
		})
	
	updateAuthDisplayName = (name: string) =>
		auth.updateUser(this.id, { displayName: name })
	
	normalizeDisplayName = () =>
		this.updateAuthDisplayName(this.name)
	
	removeAuth = () =>
		auth.deleteUser(this.id)
}
