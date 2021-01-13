import { useState, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import firebase from 'lib/firebase'
import LoadingState from 'models/LoadingState'
import { ReportMessageQuery, ReportMessageProps } from './models'
import ConfirmationForm from 'components/ConfirmationForm'
import TextArea from 'components/TextArea'
import handleError from 'lib/handleError'

import styles from './index.module.scss'

import 'firebase/functions'

const functions = firebase.functions()
const reportMessage = functions.httpsCallable('reportMessage')

const ReportMessage: NextPage<ReportMessageProps> = ({ from }) => {
	const { toId, messageId } = useRouter().query as ReportMessageQuery

	const [reason, setReason] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)

	const onSubmit = useCallback(async () => {
		if (!(toId && messageId)) return

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
				className={styles.reason}
				minHeight={100}
				placeholder="Reason (optional)"
				autoFocus
				value={reason}
				setValue={setReason}
			/>
		</ConfirmationForm>
	)
}

export default ReportMessage
