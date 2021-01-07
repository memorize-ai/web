import Section from 'models/Section'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getSections = async (id: string) =>
	(await firestore.collection(`decks/${id}/sections`).get()).docs
		.map(Section.dataFromSnapshot)
		.sort((a, b) => a.index - b.index)

export default getSections
