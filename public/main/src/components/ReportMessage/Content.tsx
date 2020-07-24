import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'

import 'firebase/analytics'
import 'firebase/firestore'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

const RestrictContactContent = () => {
	const { uid, messageId } = useParams()
	
	const [message, setMessage] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const onSubmit = useCallback(() => {
		if (!(uid && messageId))
			return
		
		setLoadingState(LoadingState.Loading)
		analytics.logEvent('restrict-message', { messageId, message })
	}, [uid, messageId, message, setLoadingState])
	
	return (
		<ConfirmationForm
			title="Report"
			description="Stop receiving messages on memorize.ai"
			loadingState={loadingState}
			submitMessage="Stop receiving messages"
			submitButtonText="Turn off"
			onSubmit={onSubmit}
		/>
	)
}

export default RestrictContactContent
