import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getCreatedDecks = async (uid: string) => {
	const { docs } = await firestore
		.collection('decks')
		.where('creator', '==', uid)
		.get()

	return docs.map(Deck.dataFromSnapshot)
}

export default getCreatedDecks
