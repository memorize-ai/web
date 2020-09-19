import { Express } from 'express'

import query from './query'
import generate from './generate'

export default (app: Express) => {
	app.get(
		'/pdf/:slugId/:slug',
		async ({ query: { slugId } }, res) => {
			try {
				if (typeof slugId !== 'string') {
					res.redirect('/')
					return
				}
				
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
		'/pdf/:slugId/:slug/s/:sectionId',
		async ({ query: { slugId, sectionId } }, res) => {
			try {
				if (!(typeof slugId === 'string' && typeof sectionId === 'string')) {
					res.redirect('/')
					return
				}
				
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
