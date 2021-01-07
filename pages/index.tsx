import { NextPage, GetStaticProps } from 'next'

import PreviewDeck from 'models/PreviewDeck'
import getPreviewDeck from 'lib/getPreviewDeck'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import Dashboard from 'components/Dashboard/Home'
import Landing from 'components/Home'

interface HomeProps {
	previewDeck: PreviewDeck
}

const Home: NextPage<HomeProps> = ({ previewDeck }) =>
	useLayoutAuthState() ? <Dashboard /> : <Landing previewDeck={previewDeck} />

export const getStaticProps: GetStaticProps<
	HomeProps,
	Record<string, never>
> = async () => ({
	props: { previewDeck: await getPreviewDeck() },
	revalidate: 3600 // 1 hour
})

export default Home
