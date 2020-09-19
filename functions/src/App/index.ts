import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import { getType } from 'mime'

import { setCacheControl, setContentType } from '../utils'
import { PRERENDER_TOKEN } from '../constants'

import handleFallbacks from './fallbacks'
import handleAPI from './API'
import handlePDF from './PDF'
import handleBadges from './badges'

const storage = admin.storage().bucket()
const app = express()

export default functions.https.onRequest(app)

app.use(cors())

handleFallbacks(app)
handleAPI(app)
handlePDF(app)
handleBadges(app)

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
