import React from 'react'

import Dashboard, { DashboardTabSelection as Selection } from '..'

export default () => (
	<Dashboard selection={Selection.Market}>
		Market
	</Dashboard>
)
