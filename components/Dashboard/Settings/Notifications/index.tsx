import { FormEvent, useState, useCallback, useEffect } from 'react'

import {
	UserNotificationsType,
	FixedUserNotificationsDay,
	FixedUserNotificationsTime,
	DEFAULT_USER_NOTIFICATIONS,
	FIXED_TIME_MINUTE_STEP
} from 'models/User/Notifications'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import useCurrentUser from 'hooks/useCurrentUser'
import Settings from '..'
import Option from './Option'
import TimePicker from 'components/TimePicker'

import styles from './index.module.scss'

import 'firebase/firestore'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

const NotificationSettings = () => {
	const [currentUser] = useCurrentUser()

	const id = currentUser?.id
	const notifications = currentUser?.notifications

	const [type, setType] = useState(
		() => notifications?.type ?? DEFAULT_USER_NOTIFICATIONS.type
	)
	const [days, setDays] = useState(
		() => notifications?.fixed?.days ?? DEFAULT_USER_NOTIFICATIONS.fixed.days
	)
	const [time, setTime] = useState(
		() => notifications?.fixed?.time ?? DEFAULT_USER_NOTIFICATIONS.fixed.time
	)

	const onTypeChange = useCallback(
		async ({ target }: FormEvent<HTMLFormElement>) => {
			if (!(id && target instanceof HTMLInputElement && target.name === 'type'))
				return

			try {
				const { value } = target

				if (!(value === 'all' || value === 'fixed' || value === 'none')) return
				const type: UserNotificationsType = value

				await firestore.doc(`users/${id}`).update({
					'notifications.type': type
				})
			} catch (error) {
				handleError(error)
			}
		},
		[id]
	)

	const toggleDay = useCallback(
		async (day: FixedUserNotificationsDay) => {
			if (!id) return

			try {
				await firestore.doc(`users/${id}`).update({
					'notifications.fixed.days': days.includes(day)
						? FieldValue.arrayRemove(day)
						: FieldValue.arrayUnion(day)
				})
			} catch (error) {
				handleError(error)
			}
		},
		[id, days]
	)

	const onTimeChange = useCallback(
		async (time: FixedUserNotificationsTime) => {
			if (!id) return

			try {
				await firestore.doc(`users/${id}`).update({
					'notifications.fixed.time': time
				})
			} catch (error) {
				handleError(error)
			}
		},
		[id]
	)

	useEffect(() => {
		if (!notifications) return

		setType(notifications.type)
		setDays(notifications.fixed?.days ?? DEFAULT_USER_NOTIFICATIONS.fixed.days)
		setTime(notifications.fixed?.time ?? DEFAULT_USER_NOTIFICATIONS.fixed.time)
	}, [notifications, setType, setDays, setTime])

	return (
		<Settings
			title="Notifications"
			description="Edit your notification settings"
		>
			<form
				className={styles.root}
				onChange={onTypeChange}
				aria-disabled={!notifications}
			>
				<Option
					current={type}
					type="all"
					name="Every card"
					info={
						<>
							You'll be reminded <b>every time a card is due</b>. This is the
							most effective way to memorize.
						</>
					}
				/>
				<Option
					current={type}
					type="fixed"
					name="Fixed"
					info="You'll be reminded on these days to review any due cards."
				>
					<div className={styles.days}>
						{DAYS.map((name, day) => (
							<button
								key={day}
								type="button"
								className={styles.day}
								onClick={() => toggleDay(day as FixedUserNotificationsDay)}
								aria-selected={days.includes(day as FixedUserNotificationsDay)}
							>
								{name}
							</button>
						))}
					</div>
					<TimePicker
						className={styles.time}
						triggerClassName={styles.timeTrigger}
						contentClassName={styles.timeContent}
						step={FIXED_TIME_MINUTE_STEP}
						value={time}
						setValue={onTimeChange}
					/>
				</Option>
				<Option
					current={type}
					type="none"
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
