import Topic from 'models/Topic'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getTopics = async () =>
	(await firestore.collection('topics').get()).docs
		.map(Topic.dataFromSnapshot)
		.sort(({ name: a }, { name: b }) => a.localeCompare(b))

export default getTopics
