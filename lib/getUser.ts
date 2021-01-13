import User from 'models/User'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getUser = async (id: string) => {
	const snapshot = await firestore.doc(`users/${id}`).get()
	return snapshot.exists ? User.dataFromSnapshot(snapshot, true) : null
}

export default getUser
