import { Express } from 'express'

const PATH = '/api'
const DOCS_URL = 'https://github.com/memorize-ai/web/blob/master/API.md'

export default (app: Express) => {
	app.get(PATH, (_, res) => res.redirect(301, DOCS_URL))
}
