import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useAuthState from '../../../hooks/useAuthState'

const Content = lazy(() => import('./Content'))

export default () => {
	const isSignedIn = useAuthState()
	
	return (
		<Dashboard
			selection={isSignedIn ? Selection.Home : Selection.Market}
			className="create-deck publish-deck"
		>
			<Content />
		</Dashboard>
	)
}
