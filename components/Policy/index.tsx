import { ReactNode } from 'react'

import Head from '../Head'

import styles from './index.module.scss'

export interface PolicyProps {
	url?: string
	description: string
	title: string
	children?: ReactNode
}

const Policy = ({ url, title, description, children }: PolicyProps) => (
	<div className={styles.root}>
		<Head
			url={url}
			title={`${title} | memorize.ai`}
			description={description}
			breadcrumbs={url => [[{ name: title, url }]]}
			schema={[
				{
					'@type': 'Article',
					headline: title,
					name: title,
					description
				}
			]}
		/>
		<h1 className={styles.title}>{title}</h1>
		<hr className={styles.divider} />
		{children}
	</div>
)

export default Policy
