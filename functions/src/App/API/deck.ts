import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import Deck from '../../Deck'

const PATH = `/${API_PREFIX}/deck`

export default (app: Express) => {
	app.get(PATH, async (
		{ query: { id, short_id: shortId } },
		res
	) => {
		try {
			if (typeof id === 'string') {
				res.json((await Deck.fromId(id)).toJSON())
				return
			}
			
			if (typeof shortId === 'string') {
				res.json((await Deck.fromSlugId(shortId)).toJSON())
				return
			}
			
			res.status(400).send('You must pass an "id" or "short_id" as query parameters')
		} catch (error) {
			console.error(error)
			res.status(404).send('Deck does not exist')
		}
	})
}
