import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const EditCard = () => (
	<Dashboard selection={Selection.Decks} className="edit-card">
		<Content />
	</Dashboard>
)

export default EditCard
