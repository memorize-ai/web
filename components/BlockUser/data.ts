import { GetServerSideProps } from 'next'

import { BlockUserQuery, BlockUserProps } from './models'
import users from 'lib/cache/users'

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

	const [from, to] = await Promise.all([users.get(fromId), users.get(toId)])
	if (!(from && to)) return { notFound: true }

	return {
		props: { from }
	}
}
