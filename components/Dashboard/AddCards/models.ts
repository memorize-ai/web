import { ParsedUrlQuery } from 'querystring'

export interface AddCardsQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
	sectionId: string
}
