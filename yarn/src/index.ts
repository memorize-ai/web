import { Query } from './query'
import fetch from './fetch'

export default class Memorize {
	constructor(private apiKey: string) {}
	
	private fetch = (path: string, query: Query) =>
		fetch(path, { key: this.apiKey, ...query })
	
	userFromId = (id: string) =>
		this.fetch('user', { id })
	
	deckFromId = (id: string) =>
		this.fetch('deck', { id })
	
	deckFromShortId = (shortId: string) =>
		this.fetch('deck', { short_id: shortId })
	
	sectionFromId = (deckId: string, sectionId: string) =>
		this.fetch('section', { deck_id: deckId, section_id: sectionId })
	
	sectionsFromDeck = (deckId: string, limit?: number | null) =>
		this.fetch('section', { deck_id: deckId, limit })
	
	cardFromId = (deckId: string, cardId: string) =>
		this.fetch('card', { deck_id: deckId, card_id: cardId })
	
	cardsFromDeck = (deckId: string, limit?: number | null) =>
		this.fetch('card', { deck_id: deckId, limit })
	
	cardsFromSection = (deckId: string, sectionId: string, limit?: number | null) =>
		this.fetch('card', { deck_id: deckId, section_id: sectionId, limit })
	
	topicFromId = (id: string) =>
		this.fetch('topic', { id })
	
	topicFromName = (name: string) =>
		this.fetch('topic', { name })
	
	topics = (category?: string | null) =>
		this.fetch('topic', { category })
}

export { Memorize }
export { default as MemorizeError } from './error'
