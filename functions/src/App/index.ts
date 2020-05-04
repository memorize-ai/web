import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import { PRERENDER_TOKEN } from '../constants'
import handleAPI from './API'

const storage = admin.storage().bucket()
const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())
app.use(require('prerender-node').set('prerenderToken', PRERENDER_TOKEN))

handleAPI(app)

app.get('*', async ({ url }, res) => {
	if (/\.(css|js|jpg|jpeg|gif|png|eot|otf|ttf|ttc|woff)$/i.test(url)) {
		res.send(await storage.file(`${url.slice(url.lastIndexOf('/') + 1)}`).download())
		return
	}
	
	res.sendFile('/srv/public.html')
})
