import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import { PRERENDER_TOKEN } from '../constants'
import handleAPI from './API'

const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())
app.use(require('prerender-node').set('prerenderToken', PRERENDER_TOKEN))

handleAPI(app)

app.get('*', (_, res) =>
	res.sendFile('/srv/public.html')
)
