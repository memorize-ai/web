import { useState, useCallback } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import firebase from 'lib/firebase'
import admin from 'lib/firebase/admin'
import User, { UserData } from 'models/User'
import LoadingState from 'models/LoadingState'
import ConfirmationForm from 'components/ConfirmationForm'
import TextArea from 'components/TextArea'
import { handleError } from 'lib/utils'

import 'firebase/functions'

const functions = firebase.functions()
const reportMessage = functions.httpsCallable('reportMessage')

interface ReportMessageQuery extends ParsedUrlQuery {
	fromId: string
	toId: string
	messageId: string
}

interface ReportMessageProps {
	from: UserData
}

const ReportMessage: NextPage<ReportMessageProps> = ({ from }) => {
	const { toId, messageId } = useRouter().query as ReportMessageQuery
	
	const [reason, setReason] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const onSubmit = useCallback(async () => {
		if (!(toId && messageId))
			return
		
		try {
			setLoadingState(LoadingState.Loading)
			
			await reportMessage({
				from: from.id,
				to: toId,
				message: messageId,
				reason
			})
			
			setLoadingState(LoadingState.Success)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [from.id, toId, messageId, reason, setLoadingState])
	
	return (
		<ConfirmationForm
			title={`Report ${from.name}`}
			description={`Report ${from.name} on memorize.ai`}
			loadingState={loadingState}
			submitMessage={`Report ${from.name}`}
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

export const getServerSideProps: GetServerSideProps<ReportMessageProps, ReportMessageQuery> = async ({ params }) => {
	const firestore = admin.firestore()
	const { fromId, toId, messageId } = params
	
	if (fromId === toId)
		return {
			redirect: { permanent: false, destination: '/' }
		}
	
	const [from, to, message] = await Promise.all([
		firestore.doc(`users/${fromId}`).get(),
		firestore.doc(`users/${toId}`).get(),
		firestore.doc(`messages/${messageId}`).get()
	])
	
	if (!(from.exists && to.exists && message.exists))
		return { notFound: true }
	
	if (!(message.get('from') === from.id && message.get('to') === to.id))
		return {
			redirect: { permanent: false, destination: '/' }
		}
	
	return {
		props: { from: User.dataFromSnapshot(from) }
	}
}

export default ReportMessage
