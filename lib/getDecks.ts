import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getQuery = (limit: number | null) => {
	const collection = firestore.collection('decks')
	
	return limit === null
		? collection
		: collection.orderBy('currentUserCount', 'desc').limit(limit)
}

const getDecks = async (limit: number | null = null) =>
	(await getQuery(limit).get()).docs.map(Deck.dataFromSnapshot)

export default getDecks
