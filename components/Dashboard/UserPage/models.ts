import { ParsedUrlQuery } from 'querystring'

import { UserData } from 'models/User'
import { DeckData } from 'models/Deck'

export interface UserPageQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
}

export interface UserPageProps {
	user: UserData
	decks: DeckData[]
}

export interface UserPagePath {
	params: UserPageQuery
}
