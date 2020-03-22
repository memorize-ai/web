import React, { PropsWithChildren } from 'react'

import Sidebar from './Sidebar'
import Content from './Content'
import Tabs from './Tabs'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardTabSelection {
	Home,
	Market,
	Decks,
	Interests
}

export default ({
	selection,
	children
}: PropsWithChildren<{ selection: DashboardTabSelection }>) => (
	<div className="dashboard">
		<Sidebar />
		<Content>{children}</Content>
		<Tabs selection={selection} />
	</div>
)
