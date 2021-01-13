import { ParsedUrlQuery } from 'querystring'

export interface EditDeckQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
}
