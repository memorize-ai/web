import * as admin from 'firebase-admin'
import { RequestHandler } from 'express'

import { SUPPORT_EMAIL } from '../../constants'

const { FieldValue } = admin.firestore
const firestore = admin.firestore()

export const verifyApiKey: RequestHandler = async ({ query: { key } }, res, next) => {
	if (typeof key !== 'string') {
		res.status(400).send('You must send your API key in the "key" query parameter')
		return
	}
	
	const doc = firestore.doc(`apiKeys/${key}`)
	const snapshot = await doc.get()
	
	if (!snapshot.exists) {
		res.status(401).send('Invalid API key')
		return
	}
	
	if (!snapshot.get('enabled')) {
		res.status(403).send(`Your API key has been revoked. Contact ${SUPPORT_EMAIL} for more information.`)
		return
	}
	
	await doc.update({ requests: FieldValue.increment(1) })
	next()
}
