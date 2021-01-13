import { GetStaticProps } from 'next'

import getPreviewDeck from 'lib/getPreviewDeck'
import { HomeProps } from 'components/Home'

const REVALIDATE = 3600 // 1 hour

export const getStaticProps: GetStaticProps<
	HomeProps,
	Record<string, never>
> = async () => ({
	props: { previewDeck: await getPreviewDeck() },
	revalidate: REVALIDATE
})
