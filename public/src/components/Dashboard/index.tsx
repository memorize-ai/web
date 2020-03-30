import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardNavbarSelection {
	Home,
	Market,
	Decks,
	Interests
}

export default (
	{ selection, className, children }: PropsWithChildren<{
		selection: DashboardNavbarSelection
		className: string
	}>
) => (
	<div className="dashboard">
		<Sidebar />
		<div className="content">
			<div className="background" />
			<div className="container">
				<Navbar selection={selection} />
				<div className={cx('foreground', className)}>
					{children}
				</div>
			</div>
		</div>
	</div>
)
