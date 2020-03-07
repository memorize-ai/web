import React from 'react'
import Helmet from 'react-helmet'

import TopGradient from '../shared/TopGradient'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Disqus from '../shared/Disqus'

export default () => (
	<>
		<Helmet>
			<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
			<title>memorize.ai</title>
		</Helmet>
		<TopGradient>
			<h1 className="text-4xl text-center">Welcome to memorize.ai</h1>
			<div className="flex justify-center">
				<AppStoreDownloadButton className="raise-on-hover" />
			</div>
			<div className="mx-8">
				<Disqus title="Home" id="home" />
			</div>
		</TopGradient>
	</>
)
