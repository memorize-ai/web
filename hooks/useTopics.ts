import { useState, useEffect } from 'react'

import Topic from 'models/Topic'
import firebase from 'lib/firebase'
import { handleError } from 'lib/utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

const getTopics = async () =>
	(await firestore.collection('topics').get()).docs
		.map(Topic.fromSnapshot)
		.sort(({ name: a }, { name: b }) => a.localeCompare(b))

const useTopics = () => {
	const [topics, setTopics] = useState(null as Topic[] | null)
	
	useEffect(() => {
		getTopics().then(setTopics).catch(handleError)
	}, [setTopics])
	
	return topics
}

export default useTopics
