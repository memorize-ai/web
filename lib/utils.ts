import { toast } from 'react-toastify'
import sample from 'lodash/sample'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

import {
	EMOJIS,
	LONG_DATE_FORMATTER_MONTH,
	LONG_DATE_FORMATTER_DAY,
	LONG_DATE_FORMATTER_YEAR
} from './constants'
import firebase from './firebase'

type HubSpotQueue = [string, Record<string, unknown>][]

export const isIos = () =>
	process.browser &&
	/iPhone|iPad|iPod/.test(navigator.userAgent) &&
	!window.MSStream

/** Does not include iPads */
export const isIosHandheld = () =>
	process.browser && /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

export const compose = <T extends unknown[], U, V>(
	b: (u: U) => V,
	a: (...args: T) => U
) => (...args: T) => b(a(...args))

export const sleep = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const showSuccess = (message: string) => {
	toast.success(message, { className: 'toast' })
}

export const handleError = (error: { message: string }) => {
	toast.error(error?.message ?? 'An unknown error occurred', {
		className: 'toast'
	})
	console.error(error)
}

export const isNullish = <T>(
	value: T | null | undefined
): value is null | undefined => value === null || value === undefined

export const includesNormalized = (query: string, values: string[]) => {
	const normalizedQuery = query.replace(/\s+/g, '').toLowerCase()

	return values.some(value =>
		value.replace(/\s+/g, '').toLowerCase().includes(normalizedQuery)
	)
}

export const formatNumber = (number: number) => {
	const logResult = Math.log10(Math.abs(number))

	const decimalResult = toOneDecimalPlace(
		number / Math.pow(10, Math.min(3, Math.floor(logResult)))
	)

	const formattedDecimalResult = (Number.isInteger(decimalResult)
		? Math.floor(decimalResult)
		: decimalResult
	).toString()

	if (logResult < 3)
		return (Number.isInteger(number)
			? Math.floor(number)
			: toOneDecimalPlace(number)
		).toString()

	if (logResult < 6) return `${formattedDecimalResult}k`

	if (logResult < 9) return `${formattedDecimalResult}m`

	if (logResult < 12) return `${formattedDecimalResult}b`

	return 'overflow'
}

export const formatNumberAsInt = (number: number) =>
	Math.abs(number) < 1000 ? Math.floor(number).toString() : formatNumber(number)

export const toOneDecimalPlace = (number: number) =>
	Math.round(number * 10) / 10

export const randomEmoji = () => sample(EMOJIS) ?? EMOJIS[0]

export const slugify = (string: string, delimiter = '-') =>
	string
		.replace(/[\s\:\/\?#@\[\]\-_!\$&'\(\)\*\+\.\,;=]+/g, ' ') // eslint-disable-line
		.trim()
		.replace(/\s+/g, delimiter)
		.toLowerCase() || delimiter.repeat(string.length)

export const safeDivide = (a: number, b: number) => a / (b || 1)

export const rankingToString = (ranking: number) => {
	switch (ranking) {
		case 1:
			return '1st'
		case 2:
			return '2nd'
		case 3:
			return '3rd'
		default:
			return `${ranking}th`
	}
}

export const hubSpotIdentifyUser = (user: firebase.User) => {
	const queue = (((window as unknown) as Record<
		string,
		unknown
	>)._hsq ||= []) as HubSpotQueue

	queue.push(['identify', { id: user.uid, email: user.email }])
}

export const formatLongDate = (date: Date) =>
	`${LONG_DATE_FORMATTER_MONTH.format(date)} ${LONG_DATE_FORMATTER_DAY.format(
		date
	)}, ${LONG_DATE_FORMATTER_YEAR.format(date)}`

export const flattenQuery = <Query extends Record<string, unknown>>(
	query: Query
) => pickBy(query, identity) as Query
