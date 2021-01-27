import firebase from './firebase/admin'

const firestore = firebase.firestore()
let count: number | null = null

const getNumberOfDecks = async (): Promise<number> =>
	(count ??= (await firestore.doc('counters/decks').get()).get('value') ?? 0)

export default getNumberOfDecks
