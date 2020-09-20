namespace Print {
	export interface Context {
		deck_name: string
		cards: Card[]
	}
	
	export interface Section {
		name: string
		card_count: number
	}
	
	export interface Card {
		section_index: number
		section: Section
		front: string
		back: string
	}
}

export default Print
