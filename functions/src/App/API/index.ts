import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import { verifyApiKey } from './utils'

import handleUploadDeckAsset from './uploadDeckAsset'
import handleUser from './user'
import handleDeck from './deck'
import handleSection from './section'
import handleCard from './card'
import handleTopic from './topic'
import handleAdmin from './admin'

export default (app: Express) => {
	app.get('/api', (_, res) =>
		res.redirect(301, 'https://github.com/memorize-ai/web/blob/master/API.md')
	)
	
	app.use((req, res, next) =>
		req.url.startsWith(`/${API_PREFIX}/`)
			? verifyApiKey(req, res, next)
			: next()
	)
	
	handleUploadDeckAsset(app)
	handleUser(app)
	handleDeck(app)
	handleSection(app)
	handleCard(app)
	handleTopic(app)
	handleAdmin(app)
}
