import React from 'react'
import Helmet from 'react-helmet'

import TopGradient from '../shared/TopGradient'
import Navbar from './Navbar'

export default () => (
	<>
		<Helmet>
			<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
			<title>memorize.ai</title>
		</Helmet>
		<TopGradient>
			<Navbar />
		</TopGradient>
	</>
)
