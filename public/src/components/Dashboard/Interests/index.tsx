import React from 'react'
import { useHistory } from 'react-router-dom'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useTopics from '../../../hooks/useTopics'
import TopicCell from './TopicCell'
import firebase from '../../../firebase'

import 'firebase/auth'

import '../../../scss/components/Dashboard/Interests.scss'

const auth = firebase.auth()

export default () => {
	requiresAuth('/interests')
	
	const history = useHistory()
	
	const signOut = async () => {
		try {
			await auth.signOut()
			
			history.push('/')
		} catch (error) {
			alert(error.message)
			console.error(error)
		}
	}
	
	return (
		<Dashboard selection={Selection.Interests} className="interests">
			<div className="sign-out-button-container">
				<button onClick={signOut}>Sign out</button>
			</div>
			<div className="topics">
				{useTopics().map(topic => (
					<TopicCell key={topic.id} topic={topic} />
				))}
			</div>
		</Dashboard>
	)
}
