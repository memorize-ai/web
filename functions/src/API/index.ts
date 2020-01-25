import * as functions from 'firebase-functions'
import * as express from 'express'

const app = express()

export default functions.https.onRequest(app)

app.post('/upload-deck-image', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.json({ link: 'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80' })
})
