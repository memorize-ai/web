import { ReactNode } from 'react'

import styles from './index.module.scss'

export interface NotificationSettingsOptionProps {
	id: string
	name: string
	info: ReactNode
	children?: ReactNode
}

const NotificationSettingsOption = ({
	id: value,
	name,
	info,
	children: data
}: NotificationSettingsOptionProps) => {
	const id = `notification-settings-option-${value}`

	return (
		<div className={styles.root}>
			<input
				id={id}
				className={styles.input}
				type="radio"
				name="type"
				value={value}
			/>
			<label className={styles.label} htmlFor={id}>
				<span className={styles.name}>{name}</span>
				<span className={styles.info}>{info}</span>
			</label>
			{data ? <div className={styles.data}>{data}</div> : null}
		</div>
	)
}

export default NotificationSettingsOption
