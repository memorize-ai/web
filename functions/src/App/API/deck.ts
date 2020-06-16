import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import Deck from '../../Deck'
import { uidFromApiKey, getDeck } from './utils'

const PATH = `/${API_PREFIX}/deck`

export default (app: Express) => {
	app.get(PATH, async (
		{ query: { id, short_id: shortId } },
		res
	) => {
		try {
			switch ('string') {
				case typeof id:
					res.json((await Deck.fromId(id as string)).toJSON())
					break
				case typeof shortId:
					res.json((await Deck.fromSlugId(shortId as string)).toJSON())
					break
				default:
					res.status(400).send('You must pass an "id" or "short_id" as query parameters')
			}
		} catch (error) {
			console.error(error)
			res.status(404).send('Deck does not exist')
		}
	})
	
	app.post(`${PATH}/get`, async ({ body }, res) => {
		const hasId = typeof body?.id === 'string'
		const hasShortId = typeof body?.short_id === 'string'
		
		if (!(
			typeof body === 'object' &&
			(hasId !== hasShortId) &&
			typeof body.key === 'string'
		)) {
			res.status(400).send('You must specify the deck ID / short ID and API key in the request body')
			return
		}
		
		const deckId: string = body[hasId ? 'id' : 'short_id']
		const apiKey: string = body.key
		
		if (!deckId.length) {
			res.status(400).send('The deck ID / short ID cannot be empty')
			return
		}
		
		if (!apiKey.length) {
			res.status(400).send('Your API key cannot be empty')
			return
		}
		
		try {
			const uid = await uidFromApiKey(apiKey)
			
			if (uid === undefined) {
				res.status(401).send('Invalid API key')
				return
			}
			
			const deck = await Deck[hasId ? 'fromId' : 'fromSlugId'](deckId)
			
			if (!(await getDeck(deck, uid))) {
				res.status(403).send('You already own this deck')
				return
			}
			
			res.json(deck.toJSON())
		} catch {
			res.status(404).send(`There are no decks matching "${deckId}"`)
		}
	})
}
