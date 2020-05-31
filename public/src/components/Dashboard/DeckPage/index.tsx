import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const DeckPage = memo(() => (
	<Dashboard selection={Selection.Market} className="deck-page">
		<Content />
	</Dashboard>
))

export default DeckPage
