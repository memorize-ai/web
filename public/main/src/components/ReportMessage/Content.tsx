import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import User from '../../models/User'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'
import TextArea from '../shared/TextArea'

import 'firebase/analytics'
import 'firebase/firestore'

import '../../scss/components/ReportMessage.scss'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

const RestrictContactContent = () => {
	const { uid, messageId } = useParams()
	
	const [user, setUser] = useState(null as User | null)
	const [message, setMessage] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const name = useMemo(() => (
		user?.name ?? '...'
	), [user])
	
	const onSubmit = useCallback(() => {
		if (!(uid && messageId))
			return
		
		setLoadingState(LoadingState.Loading)
		analytics.logEvent('restrict-message', { messageId, message })
	}, [uid, messageId, message, setLoadingState])
	
	useEffect(() => {
		firestore.doc(`users/${uid}`).get()
			.then(snapshot => setUser(User.fromSnapshot(snapshot)))
	}, [uid, setUser])
	
	return (
		<ConfirmationForm
			title={`Report ${name}`}
			description={`Report ${name} on memorize.ai`}
			loadingState={loadingState}
			submitMessage={`Report ${name}`}
			submitButtonText="Report"
			onSubmit={onSubmit}
		>
			<TextArea
				className="report-message-text-area"
				minHeight={100}
				placeholder="Reason"
				value={message}
				setValue={setMessage}
			>
				
			</TextArea>
		</ConfirmationForm>
	)
}

export default RestrictContactContent
