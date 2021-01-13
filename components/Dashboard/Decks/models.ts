import { ParsedUrlQuery } from 'querystring'

export interface DecksQuery extends ParsedUrlQuery {
	slugId?: string
	slug?: string
	unlockSectionId?: string
}
