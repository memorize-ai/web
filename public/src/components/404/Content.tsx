import React, { useEffect } from 'react'

import firebase from '../../firebase'
import Head, { APP_SCHEMA } from '../shared/Head'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	useEffect(() => {
		analytics.logEvent('404')
	}, [])
	
	return (
		<>
			<Head
				status={404}
				title="404 | memorize.ai"
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
			<h1 className="main-message">
				We think you've got the wrong URL.
			</h1>
		</>
	)
}
