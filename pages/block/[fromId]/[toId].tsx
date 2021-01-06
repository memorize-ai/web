import React, { useState, useCallback } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import firebase from 'lib/firebase'
import admin from 'lib/firebase/admin'
import User, { UserData } from 'models/User'
import LoadingState from 'models/LoadingState'
import ConfirmationForm from 'components/ConfirmationForm'
import { handleError } from 'lib/utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

interface BlockUserQuery extends ParsedUrlQuery {
	fromId: string
	toId: string
}

interface BlockUserProps {
	from: UserData
}

const BlockUser: NextPage<BlockUserProps> = ({ from }) => {
	const { toId } = useRouter().query as BlockUserQuery
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const onSubmit = useCallback(async () => {
		if (!toId)
			return
		
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
			url={`https://memorize.ai/block/${from.id}/${toId}`}
			title={`Block ${from.name}`}
			description={`Block ${from.name} from contacting you on memorize.ai`}
			loadingState={loadingState}
			submitMessage={`Block ${from.name}`}
			submitButtonText="Block"
			onSubmit={onSubmit}
		/>
	)
}

export const getServerSideProps: GetServerSideProps<BlockUserProps, BlockUserQuery> = async ({ params }) => {
	const firestore = admin.firestore()
	const { fromId, toId } = params
	
	if (fromId === toId)
		return {
			redirect: { permanent: false, destination: '/' }
		}
	
	const [from, to] = await Promise.all([
		firestore.doc(`users/${fromId}`).get(),
		firestore.doc(`users/${toId}`).get()
	])
	
	if (!(from.exists && to.exists))
		return { notFound: true }
	
	return {
		props: { from: User.dataFromSnapshot(from) }
	}
}

export default BlockUser
