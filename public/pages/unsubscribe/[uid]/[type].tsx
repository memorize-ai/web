import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'

import firebase from 'lib/firebase'
import LoadingState from 'models/LoadingState'
import Head from 'components/shared/Head'
import Content from 'components/Unsubscribe/Content'

import 'firebase/firestore'

import styles from 'styles/components/Unsubscribe.module.scss'

const firestore = firebase.firestore()

export default () => {
	const router = useRouter()
	const { uid, type } = router.query as {
		uid: string
		type: string
	}
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	useEffect(() => {
		if (!(uid && type))
			return
		
		firestore.doc(`users/${uid}`)
			.update({ [`unsubscribed.${type}`]: true })
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setErrorMessage('An unknown error occurred')
				setLoadingState(LoadingState.Fail)
				
				console.error(error)
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
							url: `https://memorize.ai${router.asPath}`
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
