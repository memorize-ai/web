import { useContext, useEffect } from 'react'

import TopicsContext from '../contexts/Topics'
import { addTopic, updateTopic, removeTopic } from '../actions'
import Topic from '../models/Topic'
import { compose } from '../utils'

export default () => {
	const [topics, dispatch] = useContext(TopicsContext)
	
	useEffect(() => {
		if (Topic.isObserving)
			return
		
		Topic.isObserving = true
		
		Topic.observeAll({
			addTopic: compose(dispatch, addTopic),
			updateTopic: compose(dispatch, updateTopic),
			removeTopic: compose(dispatch, removeTopic)
		})
	}, []) // eslint-disable-line
	
	return topics
}
