import Card from 'models/Card'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getCards = async (id: string) =>
	(await firestore.collection(`decks/${id}/cards`).get()).docs.map(
		Card.dataFromSnapshot
	)

export default getCards
