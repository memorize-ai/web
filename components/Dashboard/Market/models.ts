import { ParsedUrlQuery } from 'querystring'

export interface MarketQuery extends ParsedUrlQuery {
	q?: string
	s?: string
}

export interface MarketProps {
	decks: number
}
