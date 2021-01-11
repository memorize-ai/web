import { ParsedUrlQuery } from 'querystring'

import Deck from 'models/Deck'

export interface DecksSectionsQuery extends ParsedUrlQuery {
	unlockSectionId?: string
}

export interface DecksSectionsProps {
	deck: Deck
}
