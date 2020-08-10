import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const Interests = () => (
	<Dashboard selection={Selection.Interests} className="interests">
		<Content />
	</Dashboard>
)

export default Interests
