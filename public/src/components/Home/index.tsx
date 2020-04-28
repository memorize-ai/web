import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useQuery from '../../hooks/useQuery'
import useAuthModal from '../../hooks/useAuthModal'
import Head, { APP_DESCRIPTION, APP_SCHEMA } from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'
import firebase from '../../firebase'
import { APP_SCREENSHOT_URL } from '../../constants'

import 'firebase/analytics'

import '../../scss/components/Home/index.scss'

const analytics = firebase.analytics()

export default () => {
	analytics.setCurrentScreen('home')
	
	const history = useHistory()
	const next = useQuery().get('next')
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	useEffect(() => {
		if (!next)
			return
		
		setAuthModalIsShowing(true)
		setAuthModalCallback(() => history.push(next))
	}, [next]) // eslint-disable-line
	
	return (
		<div className="home-root">
			<Head
				canonical="https://memorize.ai"
				title="memorize.ai: Do less, learn more"
				description={APP_DESCRIPTION}
				ogImage={APP_SCREENSHOT_URL}
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
			<TopGradient>
				<Navbar />
				<Header />
				<Screenshots />
				<Boxes />
				<Integrations />
				<Footer />
			</TopGradient>
		</div>
	)
}
