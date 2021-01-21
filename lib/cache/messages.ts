import Cache from 'models/Cache'
import Message from 'models/Message'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

const messages = new Cache<string, Message | null>(async id => {
	const snapshot = await firestore.doc(`messages/${id}`).get()
	return snapshot.exists ? new Message(snapshot) : null
})

export default messages
