import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getDeckBySlugId = async (slugId: string) => {
	const { docs } = await firestore
		.collection('decks')
		.where('slugId', '==', slugId)
		.limit(1)
		.get()

	const snapshot = docs[0]
	return snapshot?.exists ? Deck.fromSnapshot(snapshot) : null
}

export default getDeckBySlugId
