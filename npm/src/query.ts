export type Query = Record<string, any>

export default (query: Query) =>
	Object.entries(query).reduce((acc, [key, value]) => (
		value === null || value === undefined
			? acc
			: `${acc ? '&' : '?'}${key}=${value}`
	), '')
