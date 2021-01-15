import User from 'models/User'
import { ActivityNodeData } from 'models/ActivityNode'
import Activity from 'components/Activity'

import styles from './index.module.scss'

export interface UserPageActivityProps {
	user: User
	activity: Record<number, ActivityNodeData>
}

const UserPageActivity = ({ user, activity }: UserPageActivityProps) => (
	<div id="activity" className={styles.root}>
		<h2 className={styles.title}>Activity</h2>
		<div className={styles.content}>
			<Activity id={user.id} nodes={activity} />
		</div>
	</div>
)

export default UserPageActivity
