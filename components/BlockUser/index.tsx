import { useState, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { BlockUserQuery, BlockUserProps } from './models'
import LoadingState from 'models/LoadingState'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import ConfirmationForm from 'components/ConfirmationForm'

import 'firebase/firestore'

const firestore = firebase.firestore()

const BlockUser: NextPage<BlockUserProps> = ({ from }) => {
	const { toId } = useRouter().query as BlockUserQuery
	const [loadingState, setLoadingState] = useState(LoadingState.None)

	const onSubmit = useCallback(async () => {
		if (!toId) return

		try {
			setLoadingState(LoadingState.Loading)
			await firestore.doc(`users/${toId}/blocked/${from.id}`).set({})
			setLoadingState(LoadingState.Success)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [toId, from.id, setLoadingState])

	return (
		<ConfirmationForm
			title={`Block ${from.name}`}
			description={`Block ${from.name} from contacting you on memorize.ai`}
			loadingState={loadingState}
			submitMessage={`Block ${from.name}`}
			submitButtonText="Block"
			onSubmit={onSubmit}
		/>
	)
}

export default BlockUser
