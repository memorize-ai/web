import { EXPECTS_SIGN_IN_KEY } from './constants'

export const compose = <T extends any[], U, V>(
	b: (u: U) => V,
	a: (...args: T) => U
) => (...args: T) => b(a(...args))

export const expectsSignIn = () =>
	localStorage.getItem(EXPECTS_SIGN_IN_KEY) !== null

export const setExpectsSignIn = (value: boolean) =>
	value
		? localStorage.setItem(EXPECTS_SIGN_IN_KEY, '1')
		: localStorage.removeItem(EXPECTS_SIGN_IN_KEY)

export const urlWithQuery = (url: string, params: Record<string, string | null>) => {
	const extension = Object.entries(params)
		.reduce((acc, [key, value]) => (
			value ? [...acc, `${key}=${encodeURIComponent(value)}`] : acc
		), [] as string[])
		.join('&')
	
	return `${url}${extension ? `?${extension}` : ''}`
}

export const isNullish = <T>(value: T | null | undefined): value is null | undefined =>
	value === null || value === undefined

export const includesNormalized = (query: string, values: string[]) => {
	const normalizedQuery = query.replace(/\s+/g, '').toLowerCase()
	
	for (const value of values)
		if (value.replace(/\s+/g, '').toLowerCase().includes(normalizedQuery))
			return true
	
	return false
}

export const formatNumber = (number: number) => {
	const logResult = Math.log10(Math.abs(number))
	
	const decimalResult =
		toOneDecimalPlace(number / Math.pow(10, Math.min(3, Math.floor(logResult))))
	
	const formattedDecimalResult =
		(isInt(decimalResult) ? Math.floor(decimalResult) : decimalResult).toString()
	
	if (logResult < 3)
		return (isInt(number) ? Math.floor(number) : toOneDecimalPlace(number)).toString()
	
	if (logResult < 6)
		return `${formattedDecimalResult}k`
	
	if (logResult < 9)
		return `${formattedDecimalResult}m`
	
	if (logResult < 12)
		return `${formattedDecimalResult}b`
	
	return 'overflow'
}

export const formatNumberAsInt = (number: number) =>
	Math.abs(number) < 1000
		? Math.floor(number).toString()
		: formatNumber(number)

export const toOneDecimalPlace = (number: number) =>
	Math.round(number * 10) / 10

export const isInt = (number: number) =>
	number === Math.floor(number)
