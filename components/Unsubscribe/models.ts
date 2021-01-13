import { ParsedUrlQuery } from 'querystring'

export interface UnsubscribeQuery extends ParsedUrlQuery {
	id: string
	type: string
}
