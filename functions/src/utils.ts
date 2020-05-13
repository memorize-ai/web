import { Response } from 'express'

import { DEFAULT_STORAGE_BUCKET } from './constants'

export const cauterize = <Args extends any[], Result, Fallback>(
	fn: (...args: Args) => Result,
	fallback?: Fallback
) => (...args: Args) => {
	try {
		return fn(...args)
	} catch (error) {
		console.error(error)
		return fallback ?? Promise.resolve()
	}
}

export const storageUrl = (pathComponents: string[], token: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${DEFAULT_STORAGE_BUCKET}/o/${pathComponents.join('%2F')}?alt=media&token=${token}`

export const setCacheControl = (res: Response, seconds: number) =>
	res.set('Cache-Control', `public, max-age=${seconds}, s-maxage=${seconds}`)

export const setContentType = (res: Response, contentType: string | null) =>
	contentType
		? res.set('Content-Type', contentType)
		: res
