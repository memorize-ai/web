import React from 'react'
import { Helmet } from 'react-helmet'

import Disqus from '../shared/Disqus'

export default () => (
	<div id="home">
		<Helmet>
			<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
			<title>memorize.ai</title>
		</Helmet>
		<h1 className="text-4xl text-center">Welcome to memorize.ai</h1>
		<div className="mx-8">
			<Disqus title="Home" id="home" />
		</div>
	</div>
)
