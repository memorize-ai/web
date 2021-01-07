import { useState, useCallback } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import firebase from 'lib/firebase'
import admin from 'lib/firebase/admin'
import LoadingState from 'models/LoadingState'
import ConfirmationForm from 'components/ConfirmationForm'
import { handleError } from 'lib/utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

interface RestrictContactQuery extends ParsedUrlQuery {
	id: string
}

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

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	RestrictContactQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }

	const firestore = admin.firestore()
	const user = await firestore.doc(`users/${params.id}`).get()

	if (!user.exists) return { notFound: true }

	return { props: {} }
}

export default RestrictContact
