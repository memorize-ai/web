import { GetStaticProps } from 'next'

import getPreviewDeck from 'lib/getPreviewDeck'
import Home, { HomeProps } from 'components/Home'

export const getStaticProps: GetStaticProps<HomeProps, Record<string, never>> = async () => ({
	props: { previewDeck: await getPreviewDeck() },
	revalidate: 3600 // 1 hour
})

export default Home
