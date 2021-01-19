import { useState, useCallback } from 'react'

import Settings from '..'
import Option from './Option'

import styles from './index.module.scss'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const NotificationSettings = () => {
	const [days, setDays] = useState<number[]>([])

	const toggleDay = useCallback(
		(day: number) => {
			setDays(days =>
				days.includes(day) ? days.filter(_day => _day !== day) : [...days, day]
			)
		},
		[setDays]
	)

	return (
		<Settings
			title="Notifications"
			description="Edit your notification settings"
		>
			<form className={styles.root}>
				<Option
					id="all"
					name="Every card"
					info={
						<>
							You'll be reminded <b>every time a card is due</b>. This is the
							most effective way to memorize.
						</>
					}
				/>
				<Option
					id="fixed"
					name="Fixed"
					info="You'll be reminded on these days to review any due cards."
				>
					<div className={styles.days}>
						{DAYS.map((name, day) => (
							<button
								key={day}
								type="button"
								className={styles.day}
								onClick={() => toggleDay(day)}
								aria-selected={days.includes(day)}
							>
								{name}
							</button>
						))}
					</div>
					<input className={styles.time} type="time" defaultValue="12:00" />
				</Option>
				<Option
					id="none"
					name="None"
					info={
						<>
							You <b>won't get notified</b> about any due cards. Make sure to
							check back on memorize.ai every couple days.
						</>
					}
				/>
			</form>
		</Settings>
	)
}

export default NotificationSettings
