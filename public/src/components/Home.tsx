import React from 'react'
import { Helmet } from 'react-helmet'
import { Heading } from 'react-bulma-components'

import Disqus from './Disqus'

import '../scss/Home.scss'

export default () => (
	<div id="home">
		<Helmet>
			<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
			<title>memorize.ai</title>
		</Helmet>
		<Heading textAlignment="centered">Welcome to memorize.ai</Heading>
		<Disqus title="Home" id="home" />
	</div>
)
