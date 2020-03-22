import React from 'react'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import useTopics from '../../../hooks/useTopics'
import TopicCell from './TopicCell'

import '../../../scss/components/Dashboard/Interests.scss'

export default () => (
	<Dashboard selection={Selection.Interests} className="interests">
		<div className="topics">
			{useTopics().map(topic => (
				<TopicCell key={topic.id} topic={topic} />
			))}
		</div>
	</Dashboard>
)
