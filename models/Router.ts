export interface RouterOptions {
	shallow: boolean
}

export interface RouterError extends Error {
	cancelled: boolean
}

export type RouterEventHandler = (url: string, options: RouterOptions) => void
export type RouterErrorEventHandler = (
	error: RouterError,
	url: string,
	options: RouterOptions
) => void
