import { GetServerSideProps } from 'next'

import { ReportMessageQuery, ReportMessageProps } from './models'
import User from 'models/User'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

export const getServerSideProps: GetServerSideProps<
	ReportMessageProps,
	ReportMessageQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }
	const { fromId, toId, messageId } = params

	if (fromId === toId)
		return {
			redirect: { permanent: true, destination: '/' }
		}

	const [from, to, message] = await Promise.all([
		firestore.doc(`users/${fromId}`).get(),
		firestore.doc(`users/${toId}`).get(),
		firestore.doc(`messages/${messageId}`).get()
	])

	if (!(from.exists && to.exists && message.exists)) return { notFound: true }

	if (!(message.get('from') === from.id && message.get('to') === to.id))
		return {
			redirect: { permanent: true, destination: '/' }
		}

	return {
		props: { from: User.dataFromSnapshot(from) }
	}
}
