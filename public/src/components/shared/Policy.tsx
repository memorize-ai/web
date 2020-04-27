import React, { PropsWithChildren, useEffect } from 'react'

import firebase from '../../firebase'
import Head, { APP_STORE_DESCRIPTION } from './Head'

import 'firebase/analytics'

import '../../scss/components/Policy.scss'

const analytics = firebase.analytics()

export default (
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
				title={`memorize.ai - ${title}`}
				description={`${description} ${APP_STORE_DESCRIPTION}`}
				breadcrumbs={[
					{
						name: title,
						url: window.location.href
					}
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
