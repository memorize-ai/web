import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

import Sidebar from './Sidebar'
import Tabs from './Tabs'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardTabSelection {
	Home,
	Market,
	Decks,
	Interests
}

export default (
	{ selection, className, children }: PropsWithChildren<{
		selection: DashboardTabSelection
		className: string
	}>
) => (
	<div className="dashboard">
		<Sidebar />
		<div className={cx('content', className)}>
			{children}
		</div>
		<Tabs selection={selection} />
	</div>
)
