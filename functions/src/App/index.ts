import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import next from 'next'
import { join, relative } from 'path'

import Deck from '../Deck'
import { PRERENDER_TOKEN } from '../constants'
import { setCacheControl } from '../utils'
import handleAPI from './API'

const nextApp = next({
	conf: {
		distDir: join(
			relative(process.cwd(), __dirname),
			'../../.next'
		)
	}
})
const handleNextRequest = nextApp.getRequestHandler()
const app = express()

let shouldPrepare = true

export default functions.https.onRequest(app)

app.use(cors())

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

handleAPI(app)

app.use(require('prerender-node').set('prerenderToken', PRERENDER_TOKEN))

app.use(async (req, res) => {
	setCacheControl(res, 60 * 60 * 24) // 1 day
	
	if (shouldPrepare) {
		shouldPrepare = false
		await nextApp.prepare()
	}
	
	await handleNextRequest(req, res)
})
