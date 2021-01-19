import { ReactNode } from 'react'

import { UserNotificationsType } from 'models/User/Notifications'

import styles from './index.module.scss'

export interface NotificationSettingsOptionProps {
	current: string
	type: UserNotificationsType
	name: string
	info: ReactNode
	children?: ReactNode
}

const NotificationSettingsOption = ({
	current,
	type,
	name,
	info,
	children: data
}: NotificationSettingsOptionProps) => {
	const id = `notification-settings-option-${type}`
	const isCurrent = current === type

	return (
		<div className={styles.root}>
			<input
				id={id}
				className={styles.input}
				type="radio"
				name="type"
				value={type}
				defaultChecked={isCurrent}
			/>
			<label className={styles.label} htmlFor={id}>
				<span className={styles.name}>{name}</span>
				<span className={styles.info}>{info}</span>
			</label>
			{data ? (
				<div className={styles.data} aria-disabled={!isCurrent}>
					{data}
				</div>
			) : null}
		</div>
	)
}

export default NotificationSettingsOption
