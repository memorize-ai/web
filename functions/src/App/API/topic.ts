import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import Topic from '../../Topic'

const PATH = `/${API_PREFIX}/topic`

export default (app: Express) => {
	app.get(PATH, async ({ query: { id, name, category } }, res) => {
		try {
			if (typeof id === 'string') {
				res.json((await Topic.fromId(id)).toJSON())
				return
			}
			
			if (typeof name === 'string') {
				res.json((await Topic.fromName(name)).toJSON())
				return
			}
			
			if (typeof category === 'string') {
				res.json(
					(await Topic.fromCategory(category))
						.map(topic => topic.toJSON())
				)
				return
			}
			
			res.status(400).send('You must pass an "id", "name", or "category" as query parameters')
		} catch (error) {
			console.error(error)
			res.status(404).send('Topic does not exist')
		}
	})
}
