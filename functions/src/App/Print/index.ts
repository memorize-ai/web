import { Express } from 'express'

import query from './query'
import generate from './generate'

export default (app: Express) => {
	app.get(
		'/print/:slugId/:slug',
		async ({ params: { slugId } }, res) => {
			try {
				res
					.contentType('application/pdf')
					.send(await generate(await query(slugId)))
			} catch (error) {
				console.error(error)
				res.status(404).send('Deck not found')
			}
		}
	)
	
	app.get(
		'/print/:slugId/:slug/s/:sectionId',
		async ({ params: { slugId, sectionId } }, res) => {
			try {
				res
					.contentType('application/pdf')
					.send(await generate(await query(slugId, sectionId)))
			} catch (error) {
				console.error(error)
				res.status(404).send('Deck not found')
			}
		}
	)
}
