import { NextPage } from 'next'

import PreviewDeck from 'models/PreviewDeck'
import getPreviewDeck from 'lib/getPreviewDeck'
import expectsSignIn from 'lib/expectsSignIn'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import Dashboard from 'components/Dashboard/Home'
import Landing from 'components/Home'

let previewDeck: PreviewDeck | null = null

interface HomeProps {
	previewDeck: PreviewDeck | null
}

const Home: NextPage<HomeProps> = ({ previewDeck }) =>
	useLayoutAuthState() ?? !previewDeck ? (
		<Dashboard expectsSignIn={!previewDeck} />
	) : (
		<Landing previewDeck={previewDeck} />
	)

Home.getInitialProps = async context => ({
	previewDeck: expectsSignIn(context)
		? null
		: (previewDeck ??= await getPreviewDeck())
})

export default Home
