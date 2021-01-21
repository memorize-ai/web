import Cache from 'models/Cache'
import User from 'models/User'
import UserData from 'models/User/Data'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

const users = new Cache<string, UserData | null>(async id => {
	const snapshot = await firestore.doc(`users/${id}`).get()
	return snapshot.exists ? User.dataFromSnapshot(snapshot, true) : null
})

export default users
