import firebase from './firebase'

import 'firebase/firestore'
import 'firebase/storage'

const firestore = firebase.firestore()
const storage = firebase.storage().ref()

const resetUserImage = async (id: string) => {
	await firestore.doc(`users/${id}`).update({ hasImage: false })
	await storage.child(`users/${id}`).delete()
}

export default resetUserImage
