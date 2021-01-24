import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dropdown, { DropdownShadow } from 'components/Dropdown'

import styles from './index.module.scss'

const HOURS = [...Array(12)]
const MINUTES = [...Array(60)]

export interface Time {
	hours: number
	minutes: number
}

interface TimePickerTriggerProps {
	value: Time
}

const TimePickerTrigger = ({ value }: TimePickerTriggerProps) => (
	<>
		{(value.hours % 12 || 12).toString().padStart(2, '0')}:
		{value.minutes.toString().padStart(2, '0')} {value.hours < 12 ? 'AM' : 'PM'}
		<FontAwesomeIcon className={styles.triggerIcon} icon={faClock} />
	</>
)

export interface TimePickerProps {
	className?: string
	triggerClassName?: string
	step?: number
	value: Time
	setValue(value: Time): void
}

const TimePicker = ({
	className,
	triggerClassName,
	step = 1,
	value,
	setValue
}: TimePickerProps) => {
	const [isShowing, setIsShowing] = useState(false)

	const am = value.hours < 12
	const minuteCount = Math.floor(60 / step)

	return (
		<Dropdown
			className={className}
			triggerClassName={cx(styles.trigger, triggerClassName)}
			contentClassName={styles.content}
			shadow={DropdownShadow.Around}
			trigger={<TimePickerTrigger value={value} />}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.column}>
				{HOURS.map((_, i) => (
					<button
						key={i}
						className={styles.option}
						type="button"
						onClick={() => {
							setValue({ hours: i + (am ? 0 : 12), minutes: value.minutes })
						}}
						aria-selected={value.hours === i + (am ? 0 : 12)}
					>
						{(i || 12).toString().padStart(2, '0')}
					</button>
				))}
			</div>
			<div className={styles.column}>
				{MINUTES.slice(0, minuteCount).map((_, i) => (
					<button
						key={i}
						className={styles.option}
						type="button"
						onClick={() => {
							setValue({ hours: value.hours, minutes: i * step })
						}}
						aria-selected={value.minutes === i * step}
					>
						{(i * step).toString().padStart(2, '0')}
					</button>
				))}
			</div>
			<div className={styles.column}>
				<button
					className={styles.option}
					type="button"
					onClick={() => {
						setValue({
							hours: value.hours < 12 ? value.hours : value.hours % 12,
							minutes: value.minutes
						})
					}}
					aria-selected={value.hours < 12}
				>
					AM
				</button>
				<button
					className={styles.option}
					type="button"
					onClick={() => {
						setValue({
							hours: value.hours < 12 ? value.hours + 12 : value.hours,
							minutes: value.minutes
						})
					}}
					aria-selected={value.hours >= 12}
				>
					PM
				</button>
			</div>
		</Dropdown>
	)
}

export default TimePicker
