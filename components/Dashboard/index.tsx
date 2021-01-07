import { PropsWithChildren, useEffect } from 'react'
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
	selection: DashboardNavbarSelection
	gradientStyle?: DashboardGradientStyle
	isNavbarHidden?: boolean
	hideChat?: boolean
	className: string
}

const Dashboard = ({
	selection,
	gradientStyle = DashboardGradientStyle.Blue,
	isNavbarHidden = false,
	hideChat: shouldHideChat = false,
	className,
	children
}: PropsWithChildren<DashboardProps>) => {
	hideChat(shouldHideChat)

	useEffect(() => {
		const { classList } = document.body

		classList.add('clipped')
		return () => classList.remove('clipped')
	}, [])

	return (
		<div className={cx('dashboard', className)}>
			<Sidebar />
			<div className="content">
				<div className={`background ${gradientStyle}-gradient`} />
				<div
					className={cx('container', {
						'navbar-hidden': isNavbarHidden
					})}
				>
					<Navbar selection={selection} />
					<div className="foreground">{children}</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
