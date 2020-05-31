import React, { PropsWithChildren, useEffect, memo } from 'react'

import firebase from '../../firebase'
import Head from './Head'

import 'firebase/analytics'

import '../../scss/components/Policy.scss'

const analytics = firebase.analytics()

const Policy = memo((
	{ id, title, description, children }: PropsWithChildren<{
		id: string
		description: string
		title: string
	}>
) => {
	useEffect(() => {
		analytics.setCurrentScreen(id)
	}, [id])
	
	return (
		<div className="policy">
			<Head
				title={`${title} | memorize.ai`}
				description={description}
				breadcrumbs={[
					[
						{
							name: title,
							url: window.location.href
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
})

export default Policy
