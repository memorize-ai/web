import React, { PropsWithChildren } from 'react'
import Helmet from 'react-helmet'
import cx from 'classnames'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardNavbarSelection {
	Home = 'Home',
	Market = 'Market',
	Decks = 'Decks',
	Interests = 'Interests'
}

export default (
	{ selection, className, gradientHeight, children }: PropsWithChildren<{
		selection: DashboardNavbarSelection
		className: string
		gradientHeight: string
	}>
) => (
	<div className="dashboard">
		<Helmet>
			<title>memorize.ai - {selection}</title>
		</Helmet>
		<Sidebar />
		<div className="content">
			<div className="background" style={{ height: gradientHeight }} />
			<div className="container">
				<Navbar selection={selection} />
				<div className={cx('foreground', className)}>
					{children}
				</div>
			</div>
		</div>
	</div>
)
