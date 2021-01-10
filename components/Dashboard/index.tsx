import { forwardRef, ReactNode, useEffect } from 'react'
import cx from 'classnames'

import hideChat from 'hooks/hideChat'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export enum DashboardNavbarSelection {
	Home = 'Home',
	Market = 'Market',
	Decks = 'Decks',
	Interests = 'Interests'
}

export enum DashboardGradientStyle {
	Blue = 'blue',
	Green = 'green'
}

export interface DashboardProps {
	className: string
	contentClassName?: string
	sidebarClassName: string
	selection: DashboardNavbarSelection
	gradientStyle?: DashboardGradientStyle
	isNavbarHidden?: boolean
	hideChat?: boolean
	expectsSignIn?: boolean
	children?: ReactNode
}

const Dashboard = forwardRef<HTMLDivElement, DashboardProps>(
	(
		{
			className,
			contentClassName,
			sidebarClassName,
			selection,
			gradientStyle = DashboardGradientStyle.Blue,
			isNavbarHidden = false,
			hideChat: shouldHideChat = false,
			expectsSignIn,
			children
		},
		ref
	) => {
		hideChat(shouldHideChat)

		useEffect(() => {
			const { classList } = document.body

			classList.add('clipped')
			return () => classList.remove('clipped')
		}, [])

		return (
			<div className={cx('dashboard', className)}>
				<Sidebar className={sidebarClassName} expectsSignIn={expectsSignIn} />
				<div className="content">
					<div className={`background ${gradientStyle}-gradient`} />
					<div className={cx('container', { 'navbar-hidden': isNavbarHidden })}>
						<Navbar selection={selection} expectsSignIn={expectsSignIn} />
						<div ref={ref} className={cx('foreground', contentClassName)}>
							{children}
						</div>
					</div>
				</div>
			</div>
		)
	}
)

export default Dashboard
