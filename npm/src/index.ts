import axios from 'axios'

import type { Auth, FetchData } from '../types'

export default class Memorize {
	constructor(private auth: Auth | null = null) {}
	
	static url = (path: string) =>
		`https://memorize.ai/_api/${path}`
	
	static fetch = (path: string, data: FetchData | null = null) => {
		const url = Memorize.url(path)
		
		return (data ? axios.post(url, data) : axios.get(url))
			.then(res => res.data)
	}
	
	deckFromId = (id: string) =>
		Memorize.fetch(`deck?id=${id}`)
	
	deckFromShortId = (shortId: string) =>
		Memorize.fetch(`deck?short_id=${shortId}`)
	
	getDeckFromId = (id: string) =>
		Memorize.fetch('deck/get', {
			id,
			auth: this.auth
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
