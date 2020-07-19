import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useAuthState from '../../../hooks/useAuthState'

const Content = lazy(() => import('./Content'))

const CreateDeck = () => {
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

export default memo(CreateDeck)
