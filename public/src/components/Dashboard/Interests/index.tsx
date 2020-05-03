import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

export default () => (
	<Dashboard selection={Selection.Interests} className="interests">
		<Content />
	</Dashboard>
)
