import React, { PropsWithChildren, ReactNode } from 'react'
import cx from 'classnames'
import Helmet from 'react-helmet'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardNavbarSelection {
	Home = 'Home',
	Market = 'Market',
	Decks = 'Decks',
	Interests = 'Interests'
}

export const selectionFromUrl = (url: string) => {
	if (url === '/')
		return DashboardNavbarSelection.Home
	
	if (url.startsWith('/market'))
		return DashboardNavbarSelection.Market
	
	if (url.startsWith('/decks'))
		return DashboardNavbarSelection.Decks
	
	if (url.startsWith('/interests'))
		return DashboardNavbarSelection.Interests
	
	return null
}

export default (
	{ selection, className, gradientHeight, navbarProps, navbarOverlay, children }: PropsWithChildren<{
		selection: DashboardNavbarSelection
		className: string
		gradientHeight: string
		navbarProps?: Record<string, any>
		navbarOverlay?: ReactNode
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
				<Navbar {...navbarProps} selection={selection} overlay={navbarOverlay} />
				<div className={cx('foreground', className)}>
					{children}
				</div>
			</div>
		</div>
	</div>
)
