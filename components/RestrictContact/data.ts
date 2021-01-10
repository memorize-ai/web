import { GetServerSideProps } from 'next'

import { RestrictContactQuery } from './models'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	RestrictContactQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }

	const user = await firestore.doc(`users/${params.id}`).get()
	if (!user.exists) return { notFound: true }

	return { props: {} }
}
