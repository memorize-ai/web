import { https } from 'firebase-functions'
import { pingable } from '../../utils'

const { onCall, HttpsError } = https

export default onCall(pingable(async (data, auth) => {
	if (!auth)
		throw new HttpsError(
			'unauthenticated',
			'You must be signed in to import a deck from Quizlet'
		)
	
	// TODO: Import deck
	
	return data
}))
