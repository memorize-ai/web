import Head from 'next/head'

import styles from 'styles/index.module.scss'

export default () => (
	<>
		<Head>
			<title>Next.js</title>
		</Head>
		<div className={styles.root}>
			<h1>If you see this, your Next.js app is working!</h1>
		</div>
	</>
)
