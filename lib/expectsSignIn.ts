import { NextPageContext } from 'next'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

const KEY = 'memorize_ai_expects_sign_in'
const VALUE = '1'
const OPTIONS = { path: '/', maxAge: 2147483647 }

const expectsSignIn = (context?: NextPageContext) =>
	process.browser || context ? parseCookies(context)[KEY] === VALUE : null

export const setExpectsSignIn = (value: boolean) => {
	value ? setCookie(null, KEY, VALUE, OPTIONS) : destroyCookie(null, KEY)
}

export default expectsSignIn
