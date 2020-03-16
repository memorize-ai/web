import React from 'react'
import Helmet from 'react-helmet'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/BasicNavbar'
import firebase from '../../firebase'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	analytics.logEvent('404')
	
	return (
		<div className="h-screen bg-light-gray">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai - 404</title>
			</Helmet>
			<TopGradient>
				<Navbar />
				<h1 className="page-404 main-message text-white text-center font-bold">
					We think you've got the wrong URL.
				</h1>
			</TopGradient>
		</div>
	)
}
