import { ReactNode } from 'react'
import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Head from 'components/Head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import requiresAuth from 'hooks/requiresAuth'
import Navigation from './Navigation'

import styles from './index.module.scss'

export interface SettingsProps {
	title: string
	description: string
	children: ReactNode
}

const Settings = ({ title, description, children }: SettingsProps) => {
	requiresAuth()

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.container}
			selection={Selection.Home}
		>
			<Head title={`${title} | memorize.ai`} description={description} />
			<h1 className={styles.title}>
				<FontAwesomeIcon className={styles.titleIcon} icon={faCog} />
				Settings
			</h1>
			<div className={styles.content}>
				<Navigation />
				<main className={styles.main}>{children}</main>
			</div>
		</Dashboard>
	)
}

export default Settings
