import { useState, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { RestrictContactQuery } from './models'
import LoadingState from 'models/LoadingState'
import firebase from 'lib/firebase'
import { handleError } from 'lib/utils'
import ConfirmationForm from 'components/ConfirmationForm'

import 'firebase/firestore'

const firestore = firebase.firestore()

const RestrictContact: NextPage<RestrictContactQuery> = () => {
	const { id } = useRouter().query as RestrictContactQuery
	const [loadingState, setLoadingState] = useState(LoadingState.None)

	const onSubmit = useCallback(async () => {
		if (!id) return

		try {
			setLoadingState(LoadingState.Loading)

			await firestore.doc(`users/${id}`).update({
				allowContact: false
			})

			setLoadingState(LoadingState.Success)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [id, setLoadingState])

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

export default RestrictContact
