import { GetStaticProps } from 'next'

import { MarketProps } from './models'
import getNumberOfDecks from 'lib/getNumberOfDecks'

const REVALIDATE = 3600 // 1 hour

export const getStaticProps: GetStaticProps<
	MarketProps,
	Record<string, never>
> = async () => ({
	props: { decks: await getNumberOfDecks() },
	revalidate: REVALIDATE
})
