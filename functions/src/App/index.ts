import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import handleAPI from './API'

const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())

handleAPI(app)
