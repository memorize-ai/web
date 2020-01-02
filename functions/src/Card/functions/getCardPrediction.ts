import * as functions from 'firebase-functions'

import CardUserData from '../UserData'
import Algorithm from '../../Algorithm'
import PerformanceRating from '../../PerformanceRating'

export default functions.https.onCall(({ deck: deckId, card: cardId }: { deck: string, card: string }, { auth }) =>
	auth
		? CardUserData.fromId(auth.uid, deckId, cardId).then(userData => {
			const now = new Date
			
			return userData
				? {
					0: Algorithm.nextDueDate(PerformanceRating.Forgot, userData, now),
					1: Algorithm.nextDueDate(PerformanceRating.Struggled, userData, now),
					2: Algorithm.nextDueDate(PerformanceRating.Easy, userData, now)
				}
				: {
					0: Algorithm.nextDueDateForNewCard(PerformanceRating.Forgot, now),
					1: Algorithm.nextDueDateForNewCard(PerformanceRating.Struggled, now),
					2: Algorithm.nextDueDateForNewCard(PerformanceRating.Easy, now)
				}
		})
		: new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
)
