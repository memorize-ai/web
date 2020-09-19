import { Express } from 'express'

import Deck from '../Deck'

export default (app: Express) => {
	app.get('/d/:slug', async ({ params: { slug } }, res) => {
		try {
			const deck = await Deck.fromId(
				slug.slice(slug.lastIndexOf('-') + 1)
			)
			
			res.redirect(301, `https://memorize.ai/d/${deck.slugId}/${deck.slug}`)
		} catch (error) {
			res.status(404).send(error)
		}
	})
	
}
