import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import Topic from '../../Topic'

const PATH = `/${API_PREFIX}/topic`

export default (app: Express) => {
	app.get(PATH, async ({ query: { id, name, category } }, res) => {
		try {
			switch ('string') {
				case typeof id:
					res.json((await Topic.fromId(id as string)).json)
					break
				case typeof name:
					res.json((await Topic.fromName(name as string)).json)
					break
				case typeof category:
					res.json(
						(await Topic.fromCategory(category as string))
							.map(({ json }) => json)
					)
					break
				default:
					res.status(400).send('You must pass an "id", "name", or "category" as query parameters')
			}
		} catch (error) {
			console.error(error)
			res.status(404).send('Topic does not exist')
		}
	})
}
