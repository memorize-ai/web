import axios from 'axios'

import type { MemorizeErrorStatus } from '../types'

export const url = (path: string) =>
	`https://memorize.ai/_api/${path}`

export const fetch = (path: string) =>
	axios.get(url(path))
		.then(({ data }) => data)
		.catch(({ response: { data, status, statusText } }) => {
			throw new MemorizeError(
				{ code: status, message: statusText },
				data
			)
		})

export const deckFromId = (id: string) =>
	fetch(`deck?id=${id}`)

export const deckFromShortId = (shortId: string) =>
	fetch(`deck?short_id=${shortId}`)

export const sectionFromId = (deckId: string, sectionId: string) =>
	fetch(`section?deck_id=${deckId}&section_id=${sectionId}`)

export const sectionsFromDeck = (deckId: string, limit?: number | null) =>
	fetch(`section?deck_id=${deckId}${limit ? `&limit=${limit}` : ''}`)

export const cardFromId = (deckId: string, cardId: string) =>
	fetch(`card?deck_id=${deckId}&card_id=${cardId}`)

export const cardsFromDeck = (deckId: string, limit?: number | null) =>
	fetch(`card?deck_id=${deckId}${limit ? `&limit=${limit}` : ''}`)

export const cardsFromSection = (deckId: string, sectionId: string, limit?: number | null) =>
	fetch(`card?deck_id=${deckId}&section_id=${sectionId}${limit ? `&limit=${limit}` : ''}`)

export const topicFromId = (id: string) =>
	fetch(`topic?id=${id}`)

export const topicFromName = (name: string) =>
	fetch(`topic?name=${name}`)

export const topics = (category?: string | null) =>
	fetch(`topic${category ? `?category=${category}` : ''}`)

export class MemorizeError extends Error {
	constructor(
		public status: MemorizeErrorStatus,
		public message: string
	) {
		super(message)
	}
}
