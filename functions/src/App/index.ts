import functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'

import handleAPI from './API'

const app = express()

export default functions.https.onRequest(app as any)

app.use(cors())

handleAPI(app)
