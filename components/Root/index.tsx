import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import expectsSignIn from 'lib/expectsSignIn'
import useLayoutAuthState from 'hooks/useLayoutAuthState'

const Dashboard = dynamic(() => import('components/Dashboard/Home'))
const Landing = dynamic(() => import('components/Home'))

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
