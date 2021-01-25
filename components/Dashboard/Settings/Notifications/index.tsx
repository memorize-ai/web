import Settings from '..'
import Notifications from 'components/Notifications'

import styles from './index.module.scss'

const ID_PREFIX = 'notification-settings'

const NotificationSettings = () => (
	<Settings title="Notifications" description="Edit your notification settings">
		<Notifications idPrefix={ID_PREFIX} timeClassName={styles.time} />
	</Settings>
)

export default NotificationSettings
