import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'

import Head from './Head'

import styles from 'styles/components/Policy.module.scss'

export default (
	{ id, title, description, children }: PropsWithChildren<{
		id: string
		description: string
		title: string
	}>
) => {
	const router = useRouter()
	
	return (
		<div className="policy">
			<Head
				title={`${title} | memorize.ai`}
				description={description}
				breadcrumbs={[
					[
						{
							name: title,
							url: `https://memorize.ai${router.asPath}`
						}
					]
				]}
				schemaItems={[
					{
						'@type': 'Article',
						headline: title,
						name: title,
						description
					}
				]}
			/>
			<h1 className="title">{title}</h1>
			<hr />
			{children}
		</div>
	)
}
