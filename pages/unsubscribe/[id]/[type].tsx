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

const TYPES = ['due-cards']

const firestore = firebase.firestore()

interface UnsubscribeQuery extends ParsedUrlQuery {
	id: string
	type: string
}

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

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	UnsubscribeQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }

	const firestore = admin.firestore()
	const { id, type } = params

	if (!TYPES.includes(type)) return { notFound: true }

	const user = await firestore.doc(`users/${id}`).get()

	if (!user.exists) return { notFound: true }

	return { props: {} }
}

export default Unsubscribe
