import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

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
import '../../scss/components/Home/Navbar.scss'

const analytics = firebase.analytics()

export default () => {
	analytics.setCurrentScreen('home')
	
	return (
		<div className="home-root">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai</title>
			</Helmet>
			<TopGradient>
				<Navbar className="home">
					<Link to="/market" className="market-tab">
						<FontAwesomeIcon icon={faSearch} />
						<p>Explore 47k decks</p>
					</Link>
					<Link to="/auth" className="auth-button">
						Log in <span>/</span> Sign up
					</Link>
				</Navbar>
				<Header />
				<Screenshots />
				<Boxes />
				<Integrations />
				<Footer />
			</TopGradient>
		</div>
	)
}
