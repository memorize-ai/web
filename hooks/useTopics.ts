import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Topic from 'models/Topic'
import state from 'state/topics'
import firebase from 'lib/firebase'
import { handleError } from 'lib/utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

const getTopics = async () =>
	(await firestore.collection('topics').get()).docs
		.map(Topic.fromSnapshot)
		.sort(({ name: a }, { name: b }) => a.localeCompare(b))

const useTopics = () => {
	const [topics, setTopics] = useRecoilState(state)
	const didLoad = Boolean(topics)

	useEffect(() => {
		if (didLoad) return
		getTopics().then(setTopics).catch(handleError)
	}, [didLoad, setTopics])

	return topics
}

export default useTopics
