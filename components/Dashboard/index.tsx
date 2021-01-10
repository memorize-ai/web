import { forwardRef, ReactNode, useEffect } from 'react'
import cx from 'classnames'

import hideChat from 'hooks/hideChat'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

import styles from './index.module.scss'

export enum DashboardNavbarSelection {
	Home,
	Market,
	Decks,
	Interests
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
	expectsSignIn?: boolean | null
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
			expectsSignIn = null,
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
			<div className={cx(styles.root, className)}>
				<Sidebar className={sidebarClassName} expectsSignIn={expectsSignIn} />
				<div className={styles.content}>
					<div
						className={cx(
							styles.background,
							styles[`gradient_${gradientStyle}`]
						)}
					/>
					<div
						className={cx(styles.container, {
							[styles.hiddenNavbar]: isNavbarHidden
						})}
					>
						<Navbar
							className={styles.navbar}
							selection={selection}
							expectsSignIn={expectsSignIn}
						/>
						<div ref={ref} className={cx(styles.foreground, contentClassName)}>
							{children}
						</div>
					</div>
				</div>
			</div>
		)
	}
)

export default Dashboard
