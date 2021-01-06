import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getDeck = async (slugId: string) => {
	const { docs } = await firestore
		.collection('decks')
		.where('slugId', '==', slugId)
		.limit(1)
		.get()
	
	const snapshot = docs[0]
	return snapshot?.exists ? Deck.dataFromSnapshot(snapshot) : null
}

export default getDeck
