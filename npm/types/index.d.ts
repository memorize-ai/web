export function url(path: string): string
export function fetch(path: string): Promise<object>

export function userFromId(id: string): Promise<User>

export function deckFromId(id: string): Promise<Deck>
export function deckFromShortId(shortId: string): Promise<Deck>

export function sectionFromId(deckId: string, sectionId: string): Promise<Section>
export function sectionsFromDeck(deckId: string, limit?: number | null): Promise<Section[]>

export function cardFromId(deckId: string, cardId: string): Promise<Card>
export function cardsFromDeck(deckId: string, limit?: number | null): Promise<Card[]>
export function cardsFromSection(deckId: string, sectionId: string, limit?: number | null): Promise<Card[]>

export function topicFromId(id: string): Promise<Topic>
export function topicFromName(name: string): Promise<Topic>
export function topics(category?: string | null): Promise<Topic[]>

export class MemorizeError {
	status: MemorizeErrorStatus
	message: string
	
	constructor(status: MemorizeErrorStatus, message: string)
}

export interface MemorizeErrorStatus {
	code: number
	message: string
}

export interface User {
	id: string
	name: string
	interests: string[]
	decks: number
	all_decks: string[]
}

export interface Deck {
	id: string
	short_id: string
	slug: string
	url: string
	topics: string[]
	has_image: boolean
	image_url: string
	name: string
	subtitle: string
	description: string
	ratings: DeckRatings
	downloads: number
	cards: number
	unsectioned_cards: number
	current_users: number
	all_time_users: number
	favorites: number
	creator_id: string
	date_created: number
	date_last_updated: number
}

export interface DeckRatings {
	average: number
	total: number
	individual: [number, number, number, number, number]
}

export interface Section {
	id: string
	name: string
	cards: number
}

export interface Card {
	id: string
	section_id: string | null
	front: string
	back: string
}

export interface Topic {
	id: string
	name: string
	category: string
}
