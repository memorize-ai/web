import { NextPage } from 'next'

import Head, { APP_SCHEMA } from 'components/Head'
import TopGradient from 'components/TopGradient'
import Navbar from 'components/Navbar'

import styles from 'styles/NotFound.module.scss'

const NotFound: NextPage = () => (
	<div className={styles.root}>
		<Head
			title="404 | memorize.ai"
			description="Oops! Looks like you have the wrong URL."
			breadcrumbs={url => [[{ name: '404', url }]]}
			schema={[APP_SCHEMA]}
		/>
		<TopGradient>
			<Navbar />
			<h1 className={styles.title}>Oh no! Are you lost?</h1>
		</TopGradient>
	</div>
)

export default NotFound
