import axios from 'axios'

import type { FetchData, MemorizeErrorStatus } from '../types'

export default class Memorize {
	constructor(public apiKey: string | null = null) {}
	
	static url = (path: string) =>
		`https://memorize.ai/_api/${path}`
	
	static fetch = (path: string, data: FetchData | null = null) => {
		const url = Memorize.url(path)
		
		return (data ? axios.post(url, data) : axios.get(url))
			.then(({ data }) => data)
			.catch(({ response: { data, status, statusText } }) => {
				throw new MemorizeError(
					{ code: status, message: statusText },
					data
				)
			})
	}
	
	deckFromId = (id: string) =>
		Memorize.fetch(`deck?id=${id}`)
	
	deckFromShortId = (shortId: string) =>
		Memorize.fetch(`deck?short_id=${shortId}`)
	
	getDeckFromId = (id: string) =>
		Memorize.fetch('deck/get', {
			id,
			key: this.apiKey
		})
	
	getDeckFromShortId = (shortId: string) =>
		Memorize.fetch('deck/get', {
			short_id: shortId,
			key: this.apiKey
		})
	
	topicFromId = (id: string) =>
		Memorize.fetch(`topic?id=${id}`)
	
	topicFromName = (name: string) =>
		Memorize.fetch(`topic?name=${name}`)
	
	topicsFromCategory = (category: string) =>
		Memorize.fetch(`topic?category=${category}`)
	
	userFromId = (id: string) =>
		Memorize.fetch(`user?id=${id}`)
}

class MemorizeError extends Error {
	constructor(
		public status: MemorizeErrorStatus,
		public message: string
	) {
		super(message)
	}
}
