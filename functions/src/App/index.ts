import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import Deck from '../Deck'
import { PRERENDER_TOKEN } from '../constants'
import handleAPI from './API'

const storage = admin.storage().bucket()
const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())

app.get('/d/:slug', async ({ params: { slug } }, res) => {
	const deck = await Deck.fromId(
		slug.slice(slug.lastIndexOf('-') + 1)
	)
	
	res.redirect(301, `https://memorize.ai/d/${deck.slugId}/${deck.slug}`)
})

app.use(require('prerender-node').set('prerenderToken', PRERENDER_TOKEN))

handleAPI(app)

app.get('*', async ({ url }, res) => {
	if (!url.startsWith('/static')) {
		res.set('Cache-Control', 'max-age=86400')
		res.sendFile('/srv/public.html')
		
		return
	}
	
	res.set('Cache-Control', 'max-age=31536000')
	
	try {
		const [data] = await storage
			.file(`public-assets/${url.slice(url.lastIndexOf('/') + 1)}`)
			.download()
		
		res.send(data)
	} catch (error) {
		res.status(404).send(error.message)
	}
})
