import { GetServerSideProps } from 'next'

import { RestrictContactQuery } from './models'
import users from 'lib/cache/users'

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	RestrictContactQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }

	const user = await users.get(params.id)
	if (!user) return { notFound: true }

	return { props: {} }
}
