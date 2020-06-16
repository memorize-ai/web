export default class Memorize {
	constructor()
	constructor(apiKey: string | null)
	
	static url(path: string): string
	
	static fetch(path: string): Promise<object>
	static fetch(path: string, data: FetchData | null): Promise<object>
	
	deckFromId(id: string): Promise<Deck>
	
	deckFromShortId(shortId: string): Promise<Deck>
	
	topicFromId(id: string): Promise<Topic>
	
	topicFromName(name: string): Promise<Topic>
	
	topicsFromCategory(category: string): Promise<Topic[]>
	
	userFromId(id: string): Promise<User>
}

export type FetchData = Record<string, any>

export interface Deck {
	
}

export interface Topic {
	
}

export interface User {
	
}
