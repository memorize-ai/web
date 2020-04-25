import React, { useEffect } from 'react'
import Helmet from 'react-helmet'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import firebase from '../../firebase'

import 'firebase/analytics'
import '../../scss/components/404.scss'

const analytics = firebase.analytics()

export default () => {
	useEffect(() => {
		analytics.logEvent('404')
	}, [])
	
	return (
		<div className="page-404">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai - 404</title>
			</Helmet>
			<TopGradient>
				<Navbar />
				<h1 className="main-message">
					We think you've got the wrong URL.
				</h1>
			</TopGradient>
		</div>
	)
}
