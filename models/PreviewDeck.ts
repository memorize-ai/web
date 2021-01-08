export default interface PreviewDeck {
	id: string
	slugId: string
	name: string
	sections: Record<string, PreviewSection>
	cards: PreviewCard[]
}

export interface PreviewSection {
	id: string
	name: string
	index: number
	numberOfCards: number
}

export interface PreviewCard {
	id: string
	sectionId: string
	front: string
	back: string
	forgotCount?: number
}
