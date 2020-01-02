import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algorithm from '../../Algorithm'
import PerformanceRating, { performanceRatingFromNumber } from '../../PerformanceRating'
import CardUserData from '../UserData'

const firestore = admin.firestore()

export default functions.https.onCall((
	{
		deck: deckId,
		card: cardId,
		rating: numberRating,
		viewTime
	}: {
		deck: string,
		card: string,
		rating: 0 | 1 | 2,
		viewTime: number
	},
	{ auth }
) => {
	if (!auth)
		return new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
	
	const rating = performanceRatingFromNumber(numberRating)
	
	if (rating === null)
		return new functions.https.HttpsError('invalid-argument', '"rating" must be 0, 1, or 2')
	
	const now = new Date
	const { uid } = auth
	const cardRef = firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`)
	
	return CardUserData.fromId(uid, deckId, cardId).then(userData =>
		userData
			? updateExistingCard(userData, cardRef, now, rating, viewTime)
			: updateNewCard(cardRef, now, rating, viewTime)
	)
})

const updateExistingCard = (
	userData: CardUserData,
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
): Promise<FirebaseFirestore.WriteResult[]> => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDate(rating, userData, date)
	
	const updateData: any = {
		due: next,
		totalCount: admin.firestore.FieldValue.increment(1),
		correctCount: admin.firestore.FieldValue.increment(isCorrect ? 1 : 0),
		streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
		e,
		mastered: rating === PerformanceRating.Easy && (userData.streak >= Algorithm.MASTERED_STREAK - 1),
		last: {
			id: historyRef.id,
			date,
			next
		}
	}
	
	switch (rating) {
		case PerformanceRating.Forgot:
			updateData.forgotCount = admin.firestore.FieldValue.increment(1)
		case PerformanceRating.Struggled:
			updateData.struggledCount = admin.firestore.FieldValue.increment(1)
		case PerformanceRating.Easy:
			updateData.easyCount = admin.firestore.FieldValue.increment(1)
	}
	
	return Promise.all([
		ref.update(updateData),
		historyRef.set({
			date,
			next,
			rating: rating.valueOf(),
			elapsed: date.getTime() - userData.last.date.getTime(),
			viewTime
		})
	])
}

const updateNewCard = (
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
): Promise<FirebaseFirestore.WriteResult[]> => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDateForNewCard(date)
	
	const setData: any = {
		due: next,
		totalCount: 1,
		streak: isCorrect ? 1 : 0,
		e,
		mastered: false,
		last: {
			id: historyRef.id,
			date,
			next
		}
	}
	
	switch (rating) {
		case PerformanceRating.Forgot:
			setData.forgotCount = 1
		case PerformanceRating.Struggled:
			setData.struggledCount = 1
		case PerformanceRating.Easy:
			setData.easyCount = 1
	}
	
	return Promise.all([
		ref.set(setData),
		historyRef.set({
			date,
			next,
			rating: rating.valueOf(),
			elapsed: 0,
			viewTime
		})
	])
}
