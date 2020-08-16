import * as functions from 'firebase-functions'

import {
	getPage,
	getPageData,
	isExistingDeckFromOriginalId,
	isExistingDeckFromId
} from '../quizlet/meta'
import { pingable } from '../../utils'

const { HttpsError } = functions.https

export default functions.runWith({
	timeoutSeconds: 540,
	memory: '2GB'
}).https.onCall(pingable(async url => {
	if (typeof url !== 'string')
		throw new HttpsError('invalid-argument', 'You must send a Quizlet set URL')
	
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
	
	return {
		url: page.url,
		image: data.imageUrl,
		name: data.name,
		existing:
			await isExistingDeckFromOriginalId(data.id) ??
			await isExistingDeckFromId(data.id)
	}
}))
