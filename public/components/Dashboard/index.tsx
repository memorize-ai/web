import React, { PropsWithChildren, useEffect, Suspense } from 'react'
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
	{ selection, className, children }: PropsWithChildren<{
		selection: DashboardNavbarSelection
		className: string
	}>
) => {
	useEffect(() => {
		const { body } = document
		
		body.classList.add('clipped')
		
		return () => body.classList.remove('clipped')
	}, [])
	
	return (
		<div className={cx('dashboard', className)}>
			<Sidebar />
			<div className="content">
				<div className="background" />
				<div className="container">
					<Navbar selection={selection} />
					<div className="foreground">
						<Suspense fallback={null}>
							{children}
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	)
}
