import * as functions from 'firebase-functions'

import CardUserData from '../UserData'
import Algorithm from '../../Algorithm'
import PerformanceRating from '../PerformanceRating'
import { pingable } from '../../utils'

export default functions.https.onCall(pingable(async (
	{ deck: deckId, card: cardId }: { deck: string, card: string },
	{ auth }
) => {
	const userData = auth
		? await CardUserData.fromId(auth.uid, deckId, cardId)
		: new CardUserData()
	
	const now = new Date()
	
	const getPrediction = (rating: PerformanceRating) =>
		Algorithm.nextDueDate(rating, userData, now).next.getTime()
	
	return {
		[PerformanceRating.Easy]: getPrediction(PerformanceRating.Easy),
		[PerformanceRating.Struggled]: getPrediction(PerformanceRating.Struggled),
		[PerformanceRating.Forgot]: getPrediction(PerformanceRating.Forgot)
	}
}))
