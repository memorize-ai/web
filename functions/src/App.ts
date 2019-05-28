import * as functions from 'firebase-functions'
import * as express from 'express'

const app = express()
const _app = functions.https.onRequest(app)
export { _app as app }

app.get('/invites/:deckId', (req, res) =>
	
)