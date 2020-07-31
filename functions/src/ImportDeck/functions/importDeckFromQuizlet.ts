import { https } from 'firebase-functions'

const { onCall, HttpsError } = https

export default onCall(async (data, auth) => {
	if (!auth)
		throw new HttpsError(
			'unauthenticated',
			'You must be signed in to import a deck from Quizlet'
		)
	
	// TODO: Import deck
	
	return data
})
