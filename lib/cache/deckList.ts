import Cache from 'models/Cache'
import Deck, { DeckData } from 'models/Deck'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

const deckList = new Cache<number, DeckData[]>(async limit => {
	const collection = firestore.collection('decks')

	const query = limit
		? collection.orderBy('currentUserCount', 'desc').limit(limit)
		: collection

	return (await query.get()).docs.map(Deck.dataFromSnapshot)
})

export default deckList
