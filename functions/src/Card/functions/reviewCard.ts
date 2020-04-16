import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algorithm from '../../Algorithm'
import PerformanceRating, { NumberPerformanceRating, performanceRatingFromNumber } from '../PerformanceRating'
import CardUserData from '../UserData'
import Section from '../../Section'
import Deck from '../../Deck'
import User from '../../User'

const firestore = admin.firestore()

export default functions.https.onCall(async (
	{
		deck: deckId,
		section: sectionId,
		card: cardId,
		rating: numberRating,
		viewTime
	}: {
		deck: string
		section: string
		card: string
		rating: NumberPerformanceRating
		viewTime: number
	},
	{ auth }
) => {
	if (!auth)
		throw new functions.https.HttpsError('failed-precondition', 'You need to be signed in')
	
	const rating = performanceRatingFromNumber(numberRating)
	
	if (rating === null)
		throw new functions.https.HttpsError('invalid-argument', '"rating" must be 0, 1, or 2')
	
	const now = new Date
	const { uid } = auth
	const cardRef = firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`)
	
	firestore.doc(`users/${uid}/decks/${deckId}`).update({
		dueCardCount: admin.firestore.FieldValue.increment(-1),
		[sectionId === Section.unsectionedId
			? 'unsectionedDueCardCount'
			: `sections.${sectionId}`
		]: admin.firestore.FieldValue.increment(-1)
	})
	
	if (Math.random() < 0.2) // 20% chance
		User.addXP((await Deck.fromId(deckId)).creatorId, User.xp.reviewCard)
	
	const userData = await CardUserData.fromId(uid, deckId, cardId)
	
	return userData.isNew
		? updateNewCard(cardRef, now, rating, viewTime)
		: updateExistingCard(userData, cardRef, now, rating, viewTime)
})

const updateNewCard = async (
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
) => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDateForNewCard(date)
	
	const data: Record<string, any> = {
		new: false,
		due: next,
		totalCount: 1,
		streak: Number(isCorrect),
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
			data.forgotCount = 1
			break
		case PerformanceRating.Struggled:
			data.struggledCount = 1
			break
		case PerformanceRating.Easy:
			data.easyCount = 1
			break
	}
	
	await Promise.all([
		ref.update(data),
		historyRef.set({
			date,
			next,
			rating,
			elapsed: 0,
			viewTime
		})
	])
	
	return false
}

const updateExistingCard = async (
	userData: CardUserData,
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
) => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const mastered = rating === PerformanceRating.Easy && (userData.streak >= Algorithm.MASTERED_STREAK - 1)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDate(rating, userData, date)
	
	const data: Record<string, any> = {
		due: next,
		totalCount: admin.firestore.FieldValue.increment(1),
		correctCount: admin.firestore.FieldValue.increment(Number(isCorrect)),
		streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
		e,
		mastered,
		last: {
			id: historyRef.id,
			date,
			next
		}
	}
	
	switch (rating) {
		case PerformanceRating.Forgot:
			data.forgotCount = admin.firestore.FieldValue.increment(1)
			break
		case PerformanceRating.Struggled:
			data.struggledCount = admin.firestore.FieldValue.increment(1)
			break
		case PerformanceRating.Easy:
			data.easyCount = admin.firestore.FieldValue.increment(1)
			break
	}
	
	await Promise.all([
		ref.update(data),
		historyRef.set({
			date,
			next,
			rating,
			elapsed: date.getTime() - userData.last.date.getTime(),
			viewTime
		})
	])
	
	return mastered && !userData.isMastered
}
