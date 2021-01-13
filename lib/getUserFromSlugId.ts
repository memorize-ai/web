import User from 'models/User'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getUserFromSlugId = async (slugId: string) => {
	const { docs } = await firestore
		.collection('users')
		.where('slugId', '==', slugId)
		.limit(1)
		.get()

	const snapshot = docs[0]
	return snapshot?.exists ? User.dataFromSnapshot(snapshot, true) : null
}

export default getUserFromSlugId
