import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const Interests = memo(() => (
	<Dashboard selection={Selection.Interests} className="interests">
		<Content />
	</Dashboard>
))

export default Interests
