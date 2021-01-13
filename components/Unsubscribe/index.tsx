import { useState, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { UnsubscribeQuery } from './models'
import LoadingState from 'models/LoadingState'
import firebase from 'lib/firebase'
import { handleError } from 'lib/utils'
import ConfirmationForm from 'components/ConfirmationForm'

import 'firebase/firestore'

const firestore = firebase.firestore()

const Unsubscribe: NextPage = () => {
	const { id, type } = useRouter().query as UnsubscribeQuery
	const [loadingState, setLoadingState] = useState(LoadingState.None)

	const onSubmit = useCallback(async () => {
		if (!(id && type)) return

		try {
			setLoadingState(LoadingState.Loading)

			await firestore.doc(`users/${id}`).update({
				[`unsubscribed.${type}`]: true
			})

			setLoadingState(LoadingState.Success)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [id, type, setLoadingState])

	return (
		<ConfirmationForm
			title="Unsubscribe"
			description="Unsubscribe from our mailing list"
			loadingState={loadingState}
			submitMessage="Unsubscribe"
			submitButtonText="Unsubscribe"
			onSubmit={onSubmit}
		/>
	)
}

export default Unsubscribe
