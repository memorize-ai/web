import Topic, { TopicData } from 'models/Topic'
import firebase from './firebase/admin'

const firestore = firebase.firestore()
let topics: TopicData[] | null = null

const getTopics = async () =>
	(topics ??= (await firestore.collection('topics').get()).docs
		.map(Topic.dataFromSnapshot)
		.sort(({ name: a }, { name: b }) => a.localeCompare(b)))

export default getTopics
