import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as uuid from 'uuid/v4'

import { API_PREFIX } from '../constants'
import { storageUrl } from '../Utils'

const firestore = admin.firestore()
const storage = admin.storage().bucket()
const app = express()

export default functions.https.onRequest(app)

app.use(cors())

interface UploadDeckAssetRequest {
	query: {
		user: string
		deck: string
	}
	body: string
}

app.post(`/${API_PREFIX}/upload-deck-asset`, async (
	{ query: { user: uid, deck: deckId }, body: rawDataString }: UploadDeckAssetRequest,
	res
) => {
	const sendError = (message: string) =>
		res.json({
			error: { message }
		})
	
	if (!(typeof uid === 'string' && typeof deckId === 'string')) {
		sendError('Invalid query parameters. Required: "user", "deck"')
		return
	}
	
	if (typeof rawDataString !== 'string') {
		sendError('You must send a base64 encoded string as a body')
		return
	}
	
	const contentTypeMatch = rawDataString.match(/data\:(.+?);base64,/)
	
	if (!contentTypeMatch) {
		sendError('Invalid image data')
		return
	}
	
	const token = uuid()
	const { id } = firestore.collection('deck-assets').doc()
	
	try {
		await storage
			.file(`deck-assets/${deckId}/${id}`)
			.save(new Buffer(rawDataString.replace(contentTypeMatch[0], ''), 'base64'), {
				public: true,
				metadata: {
					contentType: contentTypeMatch[1],
					owner: uid,
					metadata: {
						firebaseStorageDownloadTokens: token
					}
				}
			})
		
		res.json({
			url: storageUrl(['deck-assets', deckId, id], token)
		})
	} catch (error) {
		res.json({ error })
	}
})
