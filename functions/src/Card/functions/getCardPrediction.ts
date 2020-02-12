import * as functions from 'firebase-functions'

import CardUserData from '../UserData'
import Algorithm from '../../Algorithm'
import PerformanceRating from '../PerformanceRating'

export default functions.https.onCall(async ({ deck: deckId, card: cardId }: { deck: string, card: string }, { auth }) => {
	if (!auth)
		throw new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
	
	const userData = await CardUserData.fromId(auth.uid, deckId, cardId)
	
	const now = new Date
	
	if (userData.isNew) {
		const next = Algorithm.nextDueDateForNewCard(now).next.getTime()
		
		return { 0: next, 1: next, 2: next }
	}
	
	return {
		0: Algorithm.nextDueDate(PerformanceRating.Forgot, userData, now).next.getTime(),
		1: Algorithm.nextDueDate(PerformanceRating.Struggled, userData, now).next.getTime(),
		2: Algorithm.nextDueDate(PerformanceRating.Easy, userData, now).next.getTime()
	}
})
