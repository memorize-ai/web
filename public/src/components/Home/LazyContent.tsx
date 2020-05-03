import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../firebase'
import useQuery from '../../hooks/useQuery'
import useAuthModal from '../../hooks/useAuthModal'
import Head, { APP_DESCRIPTION, APP_SCHEMA } from '../shared/Head'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	const history = useHistory()
	const next = useQuery().get('next')
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	useEffect(() => {
		analytics.setCurrentScreen('home')
	}, [])
	
	useEffect(() => {
		if (!next)
			return
		
		setAuthModalIsShowing(true)
		setAuthModalCallback(() => history.push(next))
	}, [next]) // eslint-disable-line
	
	return (
		<>
			<Head
				canonicalUrl="https://memorize.ai"
				title="memorize.ai: Do less, learn more"
				description={APP_DESCRIPTION}
				breadcrumbs={[
					[
						{
							name: 'Home',
							url: 'https://memorize.ai'
						}
					]
				]}
				schemaItems={[
					APP_SCHEMA
				]}
			/>
			<Screenshots />
			<Boxes />
			<Integrations />
			<Footer />
		</>
	)
}
