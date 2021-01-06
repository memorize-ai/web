import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getNumberOfDecks = async (): Promise<number> =>
	(await firestore.doc('counters/decks').get()).get('value') ?? 0

export default getNumberOfDecks
