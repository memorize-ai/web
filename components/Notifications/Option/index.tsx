import { ReactNode } from 'react'

import { UserNotificationsType } from 'models/User/Notifications'

import styles from './index.module.scss'

export interface NotificationsOptionProps {
	idPrefix: string
	current: string
	type: UserNotificationsType
	name: string
	info: ReactNode
	children?: ReactNode
}

const NotificationsOption = ({
	idPrefix,
	current,
	type,
	name,
	info,
	children: data
}: NotificationsOptionProps) => {
	const id = `${idPrefix}-${type}`
	const isCurrent = current === type

	return (
		<div className={styles.root}>
			<input
				id={id}
				className={styles.input}
				type="radio"
				name="type"
				value={type}
				checked={isCurrent}
				readOnly
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

export default NotificationsOption
