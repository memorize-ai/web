import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algorithm from '../../Algorithm'
import User from '../../User'
import PerformanceRating, { performanceRatingFromNumber } from '../../PerformanceRating'

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
	
	return cardRef.get().then(card =>
		card.exists
			? updateExistingCard(uid, card, now, rating, viewTime)
			: updateNewCard(cardRef, now, rating, viewTime)
	)
})

const updateExistingCard = (
	uid: string,
	card: FirebaseFirestore.DocumentSnapshot,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
): Promise<[FirebaseFirestore.WriteResult, FirebaseFirestore.DocumentReference] | null> =>
	User.cardTrainingData(uid).then(allData => {
		const { id: cardId, ref } = card
		const isCorrect = rating.valueOf() > 0
		const thisData = allData.find(({ card }) => card.id === cardId)
		
		if (!thisData)
			return Promise.resolve(null)
		
		const next = Algorithm.nextDueDate(rating, thisData, allData)
		const last = thisData.history.sort(({ date: a }, { date: b }) =>
			b.getTime() - a.getTime()
		)[0]
		
		return Promise.all([
			ref.update({
				due: next,
				totalCount: admin.firestore.FieldValue.increment(1),
				correctCount: admin.firestore.FieldValue.increment(isCorrect ? 1 : 0),
				streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
				mastered: rating === PerformanceRating.Easy && (card.get('streak') >= Algorithm.MASTERED_STREAK - 1)
			}),
			ref.collection('history').add({
				date,
				next,
				rating: rating.valueOf(),
				elapsed: date.getTime() - last.date.getTime(),
				viewTime
			})
		])
	})

const updateNewCard = (
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
): Promise<[FirebaseFirestore.WriteResult, FirebaseFirestore.DocumentReference]> => {
	const isCorrect = rating.valueOf() > 0
	const streak = isCorrect ? 1 : 0
	const next = Algorithm.nextDueDateForNewCard(rating, date)
	
	return Promise.all([
		ref.set({
			due: next,
			totalCount: 1,
			correctCount: streak,
			streak,
			mastered: false
		}),
		ref.collection('history').add({
			date,
			next,
			rating: rating.valueOf(),
			elapsed: 0,
			viewTime
		})
	])
}
