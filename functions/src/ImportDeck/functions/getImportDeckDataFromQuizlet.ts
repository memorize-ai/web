import { https } from 'firebase-functions'

import {
	getPage,
	getPageData,
	isExistingDeckFromOriginalId,
	isExistingDeckFromId
} from '../quizlet'

const { onCall, HttpsError } = https

export default onCall(async rawUrl => {
	if (typeof rawUrl !== 'string')
		throw new HttpsError('invalid-argument', 'You must send a Quizlet set URL')
	
	const page = await getPage(rawUrl)
	
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
		name: data.name,
		existing:
			await isExistingDeckFromOriginalId(data.id) ??
			await isExistingDeckFromId(data.id)
	}
})
