import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getDecks = async () =>
	(await firestore.collection('decks').get())
		.docs
		.map(Deck.dataFromSnapshot)

export default getDecks
