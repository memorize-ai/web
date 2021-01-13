import { NextPage } from 'next'

import expectsSignIn from 'lib/expectsSignIn'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import Dashboard from 'components/Dashboard/Home'
import Landing from 'components/Home'

interface RootProps {
	auth: boolean
}

const Root: NextPage<RootProps> = ({ auth: initialAuthState }) =>
	useLayoutAuthState() ?? initialAuthState ? (
		<Dashboard expectsSignIn={initialAuthState} />
	) : (
		<Landing previewDeck={null} />
	)

Root.getInitialProps = async context => ({
	auth: expectsSignIn(context) ?? false
})

export default Root
