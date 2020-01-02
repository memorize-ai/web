import * as admin from 'firebase-admin'

const auth = admin.auth()
const firestore = admin.firestore()

export default class User {
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
	
	static fromId = (id: string): Promise<User> =>
		firestore.doc(`users/${id}`).get().then(snapshot =>
			new User(snapshot)
		)
	
	static incrementDeckCount = (uid: string, amount: number = 1) =>
		firestore.doc(`users/${uid}`).update({
			deckCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementDeckCount = (uid: string, amount: number = 1) =>
		User.incrementDeckCount(uid, -amount)
	
	addDeckToAllDecks = (deckId: string): Promise<FirebaseFirestore.WriteResult> =>
		firestore.doc(`users/${this.id}`).update({
			allDecks: admin.firestore.FieldValue.arrayUnion(deckId)
		})
	
	removeDeckFromAllDecks = (deckId: string): Promise<FirebaseFirestore.WriteResult> =>
		firestore.doc(`users/${this.id}`).update({
			allDecks: admin.firestore.FieldValue.arrayRemove(deckId)
		})
	
	updateAuthDisplayName = (name: string): Promise<admin.auth.UserRecord> =>
		auth.updateUser(this.id, { displayName: name })
	
	normalizeDisplayName = (): Promise<admin.auth.UserRecord> =>
		this.updateAuthDisplayName(this.name)
	
	removeAuth = (): Promise<void> =>
		auth.deleteUser(this.id)
}
