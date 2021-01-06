import { UserData } from 'models/User'
import { DeckData } from 'models/Deck'
import { SectionData } from 'models/Section'
import { CardData } from 'models/Card'
import { TopicData } from 'models/Topic'
import { ParsedUrlQuery } from 'querystring'

export interface DeckPageQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
}

export interface DeckPageProps {
	decks: number
	deck: DeckData
	creator: UserData
	sections: SectionData[]
	cards: CardData[]
	topics: TopicData[]
}
