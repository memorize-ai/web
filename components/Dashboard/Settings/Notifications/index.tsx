import Settings from '..'
import Notifications from 'components/Notifications'

import styles from './index.module.scss'

const ID_PREFIX = 'notification-settings'

const NotificationSettings = () => (
	<Settings title="Notifications" description="Edit your notification settings">
		<Notifications
			fixedClassName={styles.fixed}
			dayClassName={styles.day}
			timeTriggerClassName={styles.timeTrigger}
			timeContentClassName={styles.timeContent}
			idPrefix={ID_PREFIX}
		/>
	</Settings>
)

export default NotificationSettings
