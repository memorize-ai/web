import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Helmet from 'react-helmet'

import useQuery from '../../hooks/useQuery'
import useAuthModal from '../../hooks/useAuthModal'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'
import firebase from '../../firebase'

import 'firebase/analytics'

import '../../scss/components/Home/index.scss'

const analytics = firebase.analytics()

export default () => {
	const history = useHistory()
	const next = useQuery().get('next')
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	useEffect(() => {
		if (!next)
			return
		
		setAuthModalIsShowing(true)
		setAuthModalCallback(() => history.push(next))
	}, [next, setAuthModalIsShowing, setAuthModalCallback, history])
	
	analytics.setCurrentScreen('home')
	
	return (
		<div className="home-root">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai</title>
			</Helmet>
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
