import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as uuid from 'uuid/v4'

import { API_PREFIX, ACCOUNT_ID } from '../constants'
import { storageUrl } from '../helpers'

const firestore = admin.firestore()
const storage = admin.storage().bucket()
const app = express()

export default functions.https.onRequest(app)

app.use(cors())

app.post(`/${API_PREFIX}/upload-deck-asset`, async (
	{ query: { deck: deckId, type }, body: file }: { query: { deck: string, type: string }, body: Buffer },
	res
) => {
	if (!(deckId && type)) {
		res.json({
			error: {
				message: 'Invalid query parameters. Required: "deck", "type"'
			}
		})
		
		return
	}
	
	if (!(typeof file === 'object')) {
		res.json({
			error: {
				message: 'Invalid image data'
			}
		})
		
		return
	}
	
	const token = uuid()
	const { id } = firestore.collection('deck-assets').doc()
		
	try {
		await storage
			.file(`deck-assets/${deckId}/${id}`)
			.save(file, {
				public: true,
				metadata: {
					contentType: type,
					owner: ACCOUNT_ID,
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
