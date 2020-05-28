import * as functions from 'firebase-functions'
import next from 'next'
import { join, relative } from 'path'

const app = next({
	conf: {
		distDir: join(
			relative(process.cwd(), __dirname),
			'../.next'
		)
	}
})
const handleRequest = app.getRequestHandler()

let shouldPrepare = true

export default functions.https.onRequest(async (req, res) => {
	if (shouldPrepare) {
		shouldPrepare = false
		await app.prepare()
	}
	
	await handleRequest(req, res)
})
