import { ParsedUrlQuery } from 'querystring'

export interface EditCardQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
	cardId: string
}
