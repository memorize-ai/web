import React, { lazy, memo } from 'react'

import Dashboard, {
	DashboardNavbarSelection as Selection,
	DashboardGradientStyle as GradientStyle
} from '..'

const Content = lazy(() => import('./Content'))

const Cram = () => (
	<Dashboard
		selection={Selection.Decks}
		gradientStyle={GradientStyle.Green}
		isNavbarHidden
		className="cram"
	>
		<Content />
	</Dashboard>
)

export default memo(Cram)