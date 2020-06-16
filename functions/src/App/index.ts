import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import { getType } from 'mime'

import Deck from '../Deck'
import { PRERENDER_TOKEN } from '../constants'
import { setCacheControl, setContentType } from '../utils'
import handleAPI from './API'

const storage = admin.storage().bucket()
const app = express()

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

app.get('*', async ({ url }, res) => {
	if (!url.startsWith('/static')) {
		setCacheControl(res, 60 * 60 * 24) // 1 day
		setContentType(res, 'text/html')
		
		res.sendFile('/srv/public.html')
		return
	}
	
	setCacheControl(res, 60 * 60 * 24 * 365) // 1 year
	
	try {
		const [data] = await storage
			.file(`public-assets/${url.slice(url.lastIndexOf('/') + 1)}`)
			.download()
		
		setContentType(res, getType(url)).send(data)
	} catch (error) {
		res.status(404).send(error)
	}
})
