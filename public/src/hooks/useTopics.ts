import { useContext, useEffect } from 'react'

import TopicsContext from '../contexts/Topics'
import {
	setIsObservingTopics,
	addTopic,
	updateTopic,
	removeTopic
} from '../actions'
import Topic from '../models/Topic'
import { compose } from '../utils'

export default () => {
	const [{ topics, isObservingTopics }, dispatch] = useContext(TopicsContext)
	
	useEffect(() => {
		if (isObservingTopics)
			return
		
		dispatch(setIsObservingTopics(true))
		
		Topic.observeAll({
			addTopic: compose(dispatch, addTopic),
			updateTopic: compose(dispatch, updateTopic),
			removeTopic: compose(dispatch, removeTopic)
		})
	}, [isObservingTopics]) // eslint-disable-line
	
	return topics
}
