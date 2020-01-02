import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algorithm from '../../Algorithm'
import User from '../../User'

const firestore = admin.firestore()

export default functions.https.onCall((
	{
		deck: deckId,
		card: cardId,
		rating,
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
	rating: 0 | 1 | 2,
	viewTime: number
): Promise<[FirebaseFirestore.WriteResult, FirebaseFirestore.DocumentReference]> =>
	User.cardTrainingData(uid).then(trainingData => {
		const { id: cardId, ref } = card
		const isCorrect = rating > 0
		const next = Algorithm.nextDueDate(cardId, trainingData)
		const last = trainingData
			.find(({ card }) => card.id === cardId)?.history
			.sort(({ date: a }, { date: b }) =>
				b.getTime() - a.getTime()
			)[0]
		
		return Promise.all([
			ref.update({
				due: next,
				totalCount: admin.firestore.FieldValue.increment(1),
				correctCount: admin.firestore.FieldValue.increment(isCorrect ? 1 : 0),
				streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
				mastered: rating === 2 && (card.get('streak') >= Algorithm.MASTERED_STREAK - 1)
			}),
			ref.collection('history').add({
				date,
				next,
				rating,
				elapsed: last
					? date.getTime() - last.date.getTime()
					: 0,
				viewTime
			})
		])
	})

const updateNewCard = (
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: 0 | 1 | 2,
	viewTime: number
): Promise<[FirebaseFirestore.WriteResult, FirebaseFirestore.DocumentReference]> => {
	const isCorrect = rating > 0
	const streak = isCorrect ? 1 : 0
	const next = new Date(date.getTime() + (isCorrect ? Algorithm.INITIAL_INTERVAL : 0))
	
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
			rating,
			elapsed: 0,
			viewTime
		})
	])
}
