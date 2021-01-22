export type UserNotificationsType = 'all' | 'fixed' | 'none'
export type FixedUserNotificationsDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface FixedUserNotifications {
	days: FixedUserNotificationsDay[]
	time: FixedUserNotificationsTime
}

export interface FixedUserNotificationsTime {
	hours: number
	minutes: number
}

export default interface UserNotifications {
	type: UserNotificationsType
	fixed?: FixedUserNotifications
}

export interface DefaultUserNotifications extends UserNotifications {
	fixed: FixedUserNotifications
}

export const DEFAULT_USER_NOTIFICATIONS: DefaultUserNotifications = {
	type: 'fixed',
	fixed: {
		days: [],
		time: { hours: 12, minutes: 0 }
	}
}

export const fixedUserNotificationsTimeToString = (
	time: FixedUserNotificationsTime
) =>
	`${time.hours.toString().padStart(2, '0')}:${time.minutes
		.toString()
		.padStart(2, '0')}`

export const stringToFixedUserNotificationsTime = (
	time: string
): FixedUserNotificationsTime | null => {
	const match = time.match(/^(\d\d):(\d\d)$/)
	if (!match) return null

	const [, hoursString, minutesString] = match

	const hours = Number(hoursString)
	const minutes = Number(minutesString)

	const invalid =
		!(Number.isInteger(hours) && Number.isInteger(minutes)) ||
		hours < 0 ||
		hours >= 24 ||
		minutes < 0 ||
		minutes >= 60

	return invalid ? null : { hours, minutes }
}
