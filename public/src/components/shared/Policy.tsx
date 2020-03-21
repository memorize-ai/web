import React, { PropsWithChildren } from 'react'
import Helmet from 'react-helmet'

import firebase from '../../firebase'

import 'firebase/analytics'

import '../../scss/components/Policy.scss'

const analytics = firebase.analytics()

export default (
	{ id, title, children }: PropsWithChildren<{
		id: string
		title: string
	}>
) => {
	analytics.setCurrentScreen(id)
	
	return (
		<div className="policy">
			<Helmet>
				<meta
					name="description"
					content="The ultimate memorization tool. Download on the App Store"
				/>
				<title>memorize.ai - {title}</title>
			</Helmet>
			<h1 className="title">{title}</h1>
			<hr />
			{children}
		</div>
	)
}
