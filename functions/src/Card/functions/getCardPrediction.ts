import * as functions from 'firebase-functions'

import CardUserData from '../UserData'
import Algorithm from '../../Algorithm'
import PerformanceRating from '../../PerformanceRating'

export default functions.https.onCall(({ deck: deckId, card: cardId }: { deck: string, card: string }, { auth }) =>
	auth
		? CardUserData.fromId(auth.uid, deckId, cardId).then(userData => {
			const now = new Date
			
			if (userData)
				return {
					0: Algorithm.nextDueDate(PerformanceRating.Forgot, userData, now).next,
					1: Algorithm.nextDueDate(PerformanceRating.Struggled, userData, now).next,
					2: Algorithm.nextDueDate(PerformanceRating.Easy, userData, now).next
				}
			
			const { next } = Algorithm.nextDueDateForNewCard(now)
			
			return { 0: next, 1: next, 2: next }
		})
		: new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
)
