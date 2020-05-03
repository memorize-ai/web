import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

export default () => (
	<Dashboard selection={Selection.Decks} className="edit-deck publish-deck">
		<Content />
	</Dashboard>
)
