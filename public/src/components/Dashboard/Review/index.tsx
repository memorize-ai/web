import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const Review = () => (
	<Dashboard selection={Selection.Decks} className="review">
		<Content />
	</Dashboard>
)

export default memo(Review)
