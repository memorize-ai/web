import { EXPECTS_SIGN_IN_KEY } from './constants'

export const compose1 = <T, U, V>(b: (u: U) => V, a: (t: T) => U) => (t: T) => b(a(t))
export const compose2 = <T, U, V, W>(b: (v: V) => W, a: (t: T, u: U) => V) => (t: T, u: U) => b(a(t, u))

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
