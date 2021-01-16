import firebase from './firebase'

import 'firebase/firestore'
import 'firebase/storage'

const firestore = firebase.firestore()
const storage = firebase.storage().ref()

const uploadUserImage = async (id: string, file: File) => {
	await storage.child(`users/${id}`).put(file, {
		contentType: file.type,
		cacheControl: 'no-store',
		customMetadata: { name: file.name }
	})
	await firestore.doc(`users/${id}`).update({ hasImage: true })
}

export default uploadUserImage
