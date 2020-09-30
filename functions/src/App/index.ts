import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import { getType } from 'mime'
import { join } from 'path'

import { setCacheControl, setContentType } from '../utils'
import { PRERENDER_TOKEN, BASE_PATH } from '../constants'

import handleFallbacks from './fallbacks'
import handleAPI from './API'
import handlePrint from './Print'
import handleBadges from './badges'

const storage = admin.storage().bucket()
const app = express()

export default functions
	.runWith({ timeoutSeconds: 540, memory: '2GB' })
	.https
	.onRequest(app)

app.use(cors())

handleFallbacks(app)
handleAPI(app)
handlePrint(app)
handleBadges(app)

app.use(require('prerender-node').set('prerenderToken', PRERENDER_TOKEN))

app.get('*', async ({ url }, res) => {
	if (!url.startsWith('/static')) {
		setCacheControl(res, 60 * 60 * 24, false) // 1 day
		setContentType(res, 'text/html')
		
		res.sendFile(join(BASE_PATH, 'public.html'))
		return
	}
	
	setCacheControl(res, 60 * 60 * 24 * 365, true) // 1 year
	
	try {
		const [data] = await storage
			.file(`public-assets/${url.slice(url.lastIndexOf('/') + 1)}`)
			.download()
		
		setContentType(res, getType(url)).send(data)
	} catch (error) {
		res.status(404).send(error)
	}
})
