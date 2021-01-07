export class PrintError extends Error {
	constructor(public code: number, message: string) {
		super(message)
	}
}

export interface Context {
	deck_name: string
	cards: Card[]
}

export interface Section {
	name: string
	card_count: number
}

export interface SectionWithId {
	id: string
	data: Section
}

export interface Card {
	section_index: number
	section: Section
	front: string
	back: string
}
