import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import Head from '../shared/Head'
import Content from './Content'

import 'firebase/analytics'
import 'firebase/firestore'

import '../../scss/components/Unsubscribe.scss'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

export default () => {
	const { uid, type } = useParams()
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	useEffect(() => {
		if (!(uid && type))
			return
		
		analytics.logEvent('unsubscribe', { uid, type })
		
		firestore.doc(`users/${uid}`)
			.update({ [`unsubscribed.${type}`]: true })
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setErrorMessage(error.message)
				setLoadingState(LoadingState.Fail)
			})
	}, [uid, type])
	
	return (
		<div
			className={cx('unsubscribe', {
				success: loadingState === LoadingState.Success,
				fail: loadingState === LoadingState.Fail
			})}
		>
			<Head
				title="Unsubscribe | memorize.ai"
				description="Unsubscribe from our mailing list"
				breadcrumbs={[
					[
						{
							name: 'Unsubscribe',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					{
						'@type': 'UnRegisterAction'
					}
				]}
			/>
			<Content
				loadingState={loadingState}
				errorMessage={errorMessage}
			/>
		</div>
	)
}
