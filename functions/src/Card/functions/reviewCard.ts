import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Algorithm from '../../Algorithm'
import User from '../../User'

const firestore = admin.firestore()

export default functions.https.onCall((
	{
		user: uid,
		deck: deckId,
		card: cardId,
		rating,
		viewTime
	}: {
		user: string,
		deck: string,
		card: string,
		rating: 0 | 1 | 2,
		viewTime: number
	},
	context
) => {
	const now = new Date
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
) =>
	User.cardTrainingData(uid).then(trainingData => {
		const { ref } = card
		const isCorrect = rating > 0
		const next = Algorithm.nextDueDate(card.id, trainingData)
		
		return Promise.all([
			ref.update({
				due: next,
				totalCount: admin.firestore.FieldValue.increment(1),
				correctCount: admin.firestore.FieldValue.increment(isCorrect ? 1 : 0),
				streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
				mastered: isCorrect && (card.get('streak') >= Algorithm.MASTERED_STREAK - 1)
			}),
			ref.collection('history').add({
				date,
				next,
				rating,
				elapsed: 0, // TODO: Change this
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

export const MASTERED_STREAK = 20

export const historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const current = new Date
	const now = current.getTime()
	const uid: string = context.params.uid
	const deckId: string = context.params.deckId
	const cardId: string = context.params.cardId
	const historyId: string = context.params.historyId
	const cardRef = firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`)
	return Promise.all([
		cardRef.get().then(card => {
			const rating: number | undefined = snapshot.get('rating')
			if (rating === undefined) return Promise.resolve() as Promise<any>
			const correct = rating > 2
			const increment = correct ? 1 : 0
			if (card.exists)
				return Setting.get<boolean>('algorithm', uid).then(algorithm => {
					const last: CardLast | undefined = card.get('last')
					const elapsed = now - (last ? last.date.toMillis() : now)
					const streak = correct ? (card.get('streak') || 0) + 1 : 0
					const e = SM2.e(card.get('e') || DEFAULT_E, rating)
					return allCards(uid).then(cards => {
						const next = Algorithm.predict(cardId, cards)
						return Promise.all([
							cardRef.collection('history').doc(historyId).update({
								date: current,
								next,
								elapsed
							}),
							cardRef.update({
								count: admin.firestore.FieldValue.increment(1),
								correct: admin.firestore.FieldValue.increment(increment),
								e,
								streak,
								mastered: rating === 5 && streak >= MASTERED_STREAK,
								last: {
									id: historyId,
									date: current,
									rating,
									elapsed
								},
								next
							})
						])
					})
				})
		})
	])
})
