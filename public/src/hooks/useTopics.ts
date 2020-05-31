import { useContext, useEffect } from 'react'

import TopicsContext from '../contexts/Topics'
import { addTopics, updateTopic, removeTopic } from '../actions'
import Topic from '../models/Topic'
import { compose } from '../utils'

export default () => {
	const [topics, dispatch] = useContext(TopicsContext)
	
	useEffect(() => {
		if (Topic.isObserving)
			return
		
		Topic.isObserving = true
		
		Topic.observeAll({
			addTopics: compose(dispatch, addTopics),
			updateTopic: compose(dispatch, updateTopic),
			removeTopic: compose(dispatch, removeTopic)
		})
	}, [])
	
	return topics
}
