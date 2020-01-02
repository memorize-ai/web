import * as functions from 'firebase-functions'

import User from '../../User'
import Algorithm from '../../Algorithm'
import PerformanceRating from '../../PerformanceRating'

export default functions.https.onCall(({ id: cardId }: { id: string }, { auth }) =>
	auth
		? User.cardTrainingData(auth.uid).then(allData => {
			const thisData = allData.find(({ card }) => card.id === cardId)
			
			if (thisData)
				return {
					0: Algorithm.nextDueDate(PerformanceRating.Forgot, thisData, allData),
					1: Algorithm.nextDueDate(PerformanceRating.Struggled, thisData, allData),
					2: Algorithm.nextDueDate(PerformanceRating.Easy, thisData, allData),
				}
			
			const now = new Date
			
			return {
				0: Algorithm.nextDueDateForNewCard(PerformanceRating.Forgot, now),
				1: Algorithm.nextDueDateForNewCard(PerformanceRating.Struggled, now),
				2: Algorithm.nextDueDateForNewCard(PerformanceRating.Easy, now)
			}
		})
		: new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
)
