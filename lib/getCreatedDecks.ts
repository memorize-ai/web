import Deck from 'models/Deck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getQuery = (uid: string, limit: number | null) => {
	const query = firestore.collection('decks').where('creator', '==', uid)

	return limit === null
		? query
		: query.orderBy('currentUserCount', 'desc').limit(limit)
}

const getCreatedDecks = async (uid: string, limit: number | null = null) => {
	const { docs } = await getQuery(uid, limit).get()
	return docs.map(Deck.dataFromSnapshot)
}

export default getCreatedDecks
