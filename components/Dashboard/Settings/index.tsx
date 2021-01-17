import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Head from 'components/Head'

import styles from './index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

const Settings = () => {
	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.container}
			selection={Selection.Home}
		>
			<Head
				title="Settings | memorize.ai"
				description="Edit your settings on memorize.ai"
			/>
			<h1 className={styles.title}>
				<FontAwesomeIcon className={styles.titleIcon} icon={faCog} />
				Settings
			</h1>
			<div className={styles.content}>
				<h2 className={styles.section}>Notifications</h2>
			</div>
		</Dashboard>
	)
}

export default Settings
