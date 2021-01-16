import { GetStaticPaths, GetStaticProps } from 'next'

import { UserPageQuery, UserPageProps, UserPagePath } from './models'
import getUsers from 'lib/getUsers'
import getUserFromSlugId from 'lib/getUserFromSlugId'
import getActivity from 'lib/getActivity'
import getCreatedDecks from 'lib/getCreatedDecks'
import { VIEWABLE_CREATED_DECK_LIMIT } from 'lib/constants'

const INITIAL_USER_COUNT = 1000
const REVALIDATE = 1

export const getStaticPaths: GetStaticPaths<UserPageQuery> = async () => ({
	paths: (await getUsers(INITIAL_USER_COUNT)).reduce(
		(paths: UserPagePath[], { slugId, slug }) => {
			if (slugId && slug) paths.push({ params: { slugId, slug } })
			return paths
		},
		[]
	),
	fallback: 'blocking'
})

export const getStaticProps: GetStaticProps<
	UserPageProps,
	UserPageQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }
	const { slugId, slug } = params

	const user = await getUserFromSlugId(slugId)
	if (!(user && user.slugId && user.slug)) return { notFound: true }

	if (user.slug !== slug)
		return {
			redirect: {
				destination: `/u/${user.slugId}/${encodeURIComponent(user.slug)}`,
				permanent: true
			}
		}

	const [activity, decks] = await Promise.all([
		getActivity(user.id),
		getCreatedDecks(user.id, VIEWABLE_CREATED_DECK_LIMIT)
	])

	return {
		props: { user, activity, decks },
		revalidate: REVALIDATE
	}
}
