import { useEffect } from 'react'
import Head, { APP_SCHEMA } from 'components/shared/Head'
import TopGradient from 'components/shared/TopGradient'
import Navbar from 'components/shared/Navbar'
import firebase from 'lib/firebase'

import styles from 'styles/pages/404.module.scss'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	useEffect(() => {
		analytics.logEvent('404')
	}, [])
	
	return (
		<TopGradient>
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
			<Navbar />
			<h1 className={styles.title}>
				We think you've got the wrong URL.
			</h1>
		</TopGradient>
	)
}
