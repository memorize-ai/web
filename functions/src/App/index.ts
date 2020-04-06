import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import handleAPI from './API'

const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())
app.use(require('prerender-node').set(
	'prerenderToken',
	functions.config().prerender.token
))

handleAPI(app)

app.use(express.static('/srv/public'))
app.get('*', (_, res) => res.sendFile('/srv/public/index.html'))
