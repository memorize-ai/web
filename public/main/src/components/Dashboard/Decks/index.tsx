import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const Decks = () => (
	<Dashboard selection={Selection.Decks} className="decks">
		<Content />
	</Dashboard>
)

export default Decks
