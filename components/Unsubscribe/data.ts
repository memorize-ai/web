import { GetServerSideProps } from 'next'

import { UnsubscribeQuery } from './models'
import firebase from 'lib/firebase/admin'

const TYPES = ['due-cards']

const firestore = firebase.firestore()

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	UnsubscribeQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }
	const { id, type } = params

	if (!TYPES.includes(type)) return { notFound: true }

	const user = await firestore.doc(`users/${id}`).get()

	if (!user.exists) return { notFound: true }

	return { props: {} }
}
