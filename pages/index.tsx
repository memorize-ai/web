import { NextPage } from 'next'

import expectsSignIn from 'lib/expectsSignIn'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import Dashboard from 'components/Dashboard/Home'
import Landing from 'components/Home'

interface HomeProps {
	auth: boolean
}

const Home: NextPage<HomeProps> = ({ auth: initialAuthState }) =>
	useLayoutAuthState() ?? initialAuthState ? (
		<Dashboard expectsSignIn={initialAuthState} />
	) : (
		<Landing previewDeck={null} />
	)

Home.getInitialProps = async context => ({
	auth: expectsSignIn(context) ?? false
})

export default Home
