import { NextApiHandler } from 'next'
import { v4 as uuid } from 'uuid'

import firebase from 'lib/firebase/admin'
import getStorageUrl from 'lib/getStorageUrl'

const firestore = firebase.firestore()
const storage = firebase.storage().bucket()

interface Query {
	user: string
	deck: string
}

type Response =
	| void
	| { url: string }
	| { error: { message: string } }

const handler: NextApiHandler<Response> = async ({ method, query, body }, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', ['OPTIONS', 'POST'])
	
	const error = (status: number, message: string) =>
		res.status(status).send({ error: { message } })
	
	try {
		if (method === 'OPTIONS')
			return res.send()
		
		if (method !== 'POST')
			return error(400, 'Invalid method')
		
		const { user: uid, deck: deckId } = query as unknown as Query
		
		if (!(typeof uid === 'string' && typeof deckId === 'string'))
			return error(400, 'Invalid query parameters. Required: "user", "deck"')
		
		if (typeof body !== 'string')
			return error(400, 'You must send a base64 encoded string as a body')
		
		const contentTypeMatch = body.match(/^data:(.+?);base64,/)
		
		if (!contentTypeMatch)
			return error(400, 'Invalid image data')
		
		const token = uuid()
		const { id } = firestore.collection('deck-assets').doc()
		
		await storage
			.file(`deck-assets/${deckId}/${id}`)
			.save(Buffer.from(body.replace(contentTypeMatch[0], ''), 'base64'), {
				public: true,
				gzip: true,
				metadata: {
					contentType: contentTypeMatch[1],
					metadata: {
						firebaseStorageDownloadTokens: token,
						owner: uid
					}
				}
			})
		
		res.send({
			url: getStorageUrl(['deck-assets', deckId, id], token)
		})
	} catch ({ message }) {
		error(500, message)
	}
}

export default handler
