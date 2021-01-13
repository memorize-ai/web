import { GetServerSideProps } from 'next'

import { BlockUserQuery, BlockUserProps } from './models'
import User from 'models/User'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

export const getServerSideProps: GetServerSideProps<
	BlockUserProps,
	BlockUserQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }
	const { fromId, toId } = params

	if (fromId === toId)
		return {
			redirect: { permanent: true, destination: '/' }
		}

	const [from, to] = await Promise.all([
		firestore.doc(`users/${fromId}`).get(),
		firestore.doc(`users/${toId}`).get()
	])

	if (!(from.exists && to.exists)) return { notFound: true }

	return {
		props: { from: User.dataFromSnapshot(from) }
	}
}
