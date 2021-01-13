import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'

import { DeckPageQuery, DeckPageProps } from './models'
import getDecks from 'lib/getDecks'
import getNumberOfDecks from 'lib/getNumberOfDecks'
import getDeck from 'lib/getDeck'
import getUser from 'lib/getUser'
import getSections from 'lib/getSections'
import getCards from 'lib/getCards'
import getTopics from 'lib/getTopics'

const INITIAL_DECK_COUNT = 1000
const REVALIDATE = 1

class DeckPageError extends Error {
	constructor(public result: GetStaticPropsResult<DeckPageProps>) {
		super()
	}
}

const throwIfNull = <Result>(result: Result | null): Result => {
	if (result) return result
	throw new DeckPageError({ notFound: true })
}

const getDeckDependentData = async (slugId: string, slug: string) => {
	const deck = await getDeck(slugId).then(throwIfNull)

	if (deck.slug !== slug)
		throw new DeckPageError({
			redirect: {
				destination: `/d/${deck.slugId}/${encodeURIComponent(deck.slug)}`,
				permanent: true
			}
		})

	const [creator, sections, cards] = await Promise.all([
		getUser(deck.creatorId).then(throwIfNull),
		getSections(deck.id),
		getCards(deck.id)
	])

	return { deck, creator, sections, cards }
}

export const getStaticPaths: GetStaticPaths<DeckPageQuery> = async () => ({
	paths: (await getDecks(INITIAL_DECK_COUNT)).map(({ slugId, slug }) => ({
		params: { slugId, slug }
	})),
	fallback: 'blocking'
})

export const getStaticProps: GetStaticProps<
	DeckPageProps,
	DeckPageQuery
> = async ({ params }) => {
	try {
		if (!params) return { notFound: true }
		const { slugId, slug } = params

		const [deckDependentData, decks, allTopics] = await Promise.all([
			getDeckDependentData(slugId, slug),
			getNumberOfDecks(),
			getTopics()
		])

		const { topics } = deckDependentData.deck

		return {
			props: {
				...deckDependentData,
				decks,
				topics: allTopics.filter(({ id }) => topics.includes(id))
			},
			revalidate: REVALIDATE
		}
	} catch (error) {
		if (error instanceof DeckPageError) return error.result
		throw error
	}
}
