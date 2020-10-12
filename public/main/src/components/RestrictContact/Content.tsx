import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'
import { handleError } from '../../utils'

import 'firebase/analytics'
import 'firebase/firestore'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

interface Params {
	uid: string
}

const RestrictContactContent = () => {
	const { uid } = useParams<Params>()
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const onSubmit = useCallback(() => {
		setLoadingState(LoadingState.Loading)
		analytics.logEvent('restrict-contact', { uid })
		
		firestore.doc(`users/${uid}`)
			.update({ allowContact: false })
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setLoadingState(LoadingState.Fail)
				handleError(error)
			})
	}, [uid, setLoadingState])
	
	return (
		<ConfirmationForm
			title="Stop receiving messages"
			description="Stop receiving messages on memorize.ai"
			loadingState={loadingState}
			submitMessage="Stop receiving messages"
			submitButtonText="Turn off"
			onSubmit={onSubmit}
		/>
	)
}

export default RestrictContactContent
