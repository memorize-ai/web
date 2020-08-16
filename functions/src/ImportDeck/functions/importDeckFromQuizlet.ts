import * as functions from 'firebase-functions'

import { pingable } from '../../utils'
import { getPage, getPageData } from '../quizlet/meta'
import { createDeck, importCards } from '../quizlet/import'

const { HttpsError } = functions.https

export default functions.runWith({
	timeoutSeconds: 540,
	memory: '2GB'
}).https.onCall(pingable(async (requestData, { auth }) => {
	if (!auth)
		throw new HttpsError(
			'unauthenticated',
			'You must be signed in to import a deck from Quizlet'
		)
	
	if (typeof requestData !== 'object')
		throw new HttpsError('invalid-argument', 'You must pass in an object')
	
	const { url, image, name, subtitle, description, topics } = requestData
	
	if (!(
		typeof url === 'string' &&
		(image === null || Buffer.isBuffer(image)) &&
		typeof name === 'string' &&
		typeof subtitle === 'string' &&
		typeof description === 'string' &&
		Array.isArray(topics)
	))
		throw new HttpsError('invalid-argument', 'You didn\'t specify the right parameters')
	
	const page = await getPage(url)
	
	if (!page)
		throw new HttpsError('invalid-argument', 'Invalid Quizlet set URL')
	
	if (page.response.didFail) {
		if (page.response.status === 404)
			throw new HttpsError('not-found', 'Unable to find the Quizlet set')
		
		throw new HttpsError('internal', 'Unable to retrieve the Quizlet set')
	}
	
	const data = getPageData(page.response.data)
	
	if (!data)
		throw new HttpsError('internal', 'Unable to retrieve the Quizlet set data')
	
	const deckId = await createDeck(auth.uid, {
		originalId: data.id,
		image,
		name,
		subtitle,
		description,
		topics
	})
	
	await importCards(deckId, data.cards)
}))
