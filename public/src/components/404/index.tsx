import React, { useEffect } from 'react'

import firebase from '../../firebase'
import Head, { APP_SCHEMA } from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

import 'firebase/analytics'
import '../../scss/components/404.scss'

const analytics = firebase.analytics()

export default () => {
	useEffect(() => {
		analytics.logEvent('404')
	}, [])
	
	return (
		<div className="page-404">
			<Head
				title="memorize.ai - 404"
				description="Oops! Looks like you have the wrong URL."
				breadcrumbs={[
					[
						{
							name: '404',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					APP_SCHEMA
				]}
			/>
			<TopGradient>
				<Navbar />
				<h1 className="main-message">
					We think you've got the wrong URL.
				</h1>
			</TopGradient>
		</div>
	)
}
