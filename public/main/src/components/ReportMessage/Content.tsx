import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import User from '../../models/User'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'
import TextArea from '../shared/TextArea'
import { handleError } from '../../utils'

import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/functions'

import '../../scss/components/ReportMessage.scss'

const analytics = firebase.analytics()
const firestore = firebase.firestore()
const functions = firebase.functions()

const reportMessage = functions.httpsCallable('reportMessage')

interface Params {
	fromId: string
	toId: string
	messageId: string
}

const RestrictContactContent = () => {
	const { fromId, toId, messageId } = useParams<Params>()
	
	const [user, setUser] = useState(null as User | null)
	const [reason, setReason] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const name = useMemo(() => (
		user?.name ?? '...'
	), [user])
	
	const onSubmit = useCallback(() => {
		setLoadingState(LoadingState.Loading)
		
		const data = {
			from: fromId,
			to: toId,
			message: messageId,
			reason
		}
		
		analytics.logEvent('report-message', data)
		
		reportMessage(data)
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setLoadingState(LoadingState.Fail)
				handleError(error)
			})
	}, [fromId, toId, messageId, reason, setLoadingState])
	
	useEffect(() => {
		firestore.doc(`users/${fromId}`).get()
			.then(snapshot => setUser(User.fromSnapshot(snapshot)))
	}, [fromId, setUser])
	
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
				placeholder="Reason (optional)"
				autoFocus
				value={reason}
				setValue={setReason}
			/>
		</ConfirmationForm>
	)
}

export default RestrictContactContent
