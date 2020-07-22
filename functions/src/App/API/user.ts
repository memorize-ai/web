import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import User from '../../User'

const PATH = `/${API_PREFIX}/user`

export default (app: Express) => {
	app.get(PATH, async ({ query: { id } }, res) => {
		try {
			typeof id === 'string'
				? res.json((await User.fromId(id)).json)
				: res.status(400).send('You must pass the user\'s "id" as a query parameter')
		} catch (error) {
			console.error(error)
			res.status(404).send('User does not exist')
		}
	})
}
