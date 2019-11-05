import * as admin from 'firebase-admin'

const auth = admin.auth()
const firestore = admin.firestore()

export default class User {
	id: string
	name: string
	email: string
	interests: string
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.email = snapshot.get('email')
		this.interests = snapshot.get('topics')
	}
	
	static incrementDeckCount = (uid: string, amount: number = 1) =>
		firestore.doc(`users/${uid}`).update({
			deckCount: admin.firestore.FieldValue.increment(amount)
		})
	
	static decrementDeckCount = (uid: string, amount: number = 1) =>
		User.incrementDeckCount(uid, -amount)
	
	updateAuthDisplayName = (name: string): Promise<admin.auth.UserRecord> =>
		auth.updateUser(this.id, { displayName: name })
	
	normalizeDisplayName = (): Promise<admin.auth.UserRecord> =>
		this.updateAuthDisplayName(this.name)
	
	removeAuth = (): Promise<void> =>
		auth.deleteUser(this.id)
}
