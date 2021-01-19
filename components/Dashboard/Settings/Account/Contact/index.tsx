import { SLACK_INVITE_URL } from 'lib/constants'

import styles from './index.module.scss'

const AccountSettingsContact = () => (
	<div className={styles.root}>
		<h3 className={styles.title}>Contact</h3>
		<p className={styles.description}>
			<a
				className={styles.action}
				href={SLACK_INVITE_URL}
				target="_blank"
				rel="nofollow noreferrer noopener"
			>
				Join Slack
			</a>{' '}
			or email{' '}
			<a
				className={styles.action}
				href="mailto:support@memorize.ai"
				target="_blank"
				rel="nofollow noreferrer noopener"
			>
				support@memorize.ai
			</a>
		</p>
	</div>
)

export default AccountSettingsContact
