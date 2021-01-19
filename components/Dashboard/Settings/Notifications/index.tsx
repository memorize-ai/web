import Settings from '..'
import Option from './Option'

import styles from './index.module.scss'

const NotificationSettings = () => {
	return (
		<Settings
			title="Notifications"
			description="Edit your notification settings"
		>
			<form className={styles.root}>
				<Option id="every-card" name="Every card">
					You'll be reminded <b>every time a card is due</b>. This is the most
					effective way to memorize.
				</Option>
				<Option id="weekly" name="Weekly reminder">
					You'll be reminded to review any due cards <b>every Monday at noon</b>
					.
				</Option>
				<Option id="daily" name="Daily reminder">
					You'll be reminded to review any due cards <b>every day at noon</b>.
				</Option>
				<Option id="none" name="None">
					You <b>won't get notified</b> about any due cards. Make sure to check
					back on memorize.ai every couple days.
				</Option>
			</form>
		</Settings>
	)
}

export default NotificationSettings
