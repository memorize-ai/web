import { GetStaticProps } from 'next'

import { MarketProps } from './models'
import getNumberOfDecks from 'lib/getNumberOfDecks'

export const getStaticProps: GetStaticProps<
	MarketProps,
	Record<string, never>
> = async () => ({
	props: { decks: await getNumberOfDecks() },
	revalidate: 60
})
