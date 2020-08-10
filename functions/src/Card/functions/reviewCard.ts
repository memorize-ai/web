import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Algorithm from '../../Algorithm'
import PerformanceRating, { NumberPerformanceRating, performanceRatingFromNumber } from '../PerformanceRating'
import CardUserData from '../UserData'
import Section from '../../Section'
import { pingable, getDay } from '../../utils'

type UpdateCard = (
	userData: CardUserData,
	ref: FirebaseFirestore.DocumentReference,
	date: Date,
	rating: PerformanceRating,
	viewTime: number
) => Promise<boolean>

const firestore = admin.firestore()

// Returns if the user newly mastered the card
export default functions.https.onCall(pingable(async (
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
	
	const now = new Date()
	const { uid } = auth
	const cardRef = firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`)
	const day = getDay()
	
	const [isNewlyMastered] = await Promise.all([
		CardUserData.fromId(uid, deckId, cardId).then(userData =>
			(userData.isNew ? updateNewCard : updateExistingCard)(
				userData, cardRef, now, rating, viewTime
			)
		),
		firestore.doc(`users/${uid}/decks/${deckId}`).update({
			dueCardCount: admin.firestore.FieldValue.increment(-1),
			[sectionId === Section.unsectionedId
				? 'unsectionedDueCardCount'
				: `sections.${sectionId}`
			]: admin.firestore.FieldValue.increment(-1)
		}),
		firestore.doc(`users/${uid}/activity/${day}`).set({
			day,
			value: admin.firestore.FieldValue.increment(1)
		})
	])
	
	return isNewlyMastered
}))

const updateNewCard: UpdateCard = async (userData, ref, now, rating, viewTime) => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDate(rating, userData, now)
	
	const data: Record<string, any> = {
		new: false,
		due: next,
		totalCount: 1,
		streak: Number(isCorrect),
		e,
		mastered: false,
		last: {
			id: historyRef.id,
			date: now,
			next
		}
	}
	
	switch (rating) {
		case PerformanceRating.Easy:
			data.easyCount = 1
			break
		case PerformanceRating.Struggled:
			data.struggledCount = 1
			break
		case PerformanceRating.Forgot:
			data.forgotCount = 1
			break
	}
	
	await Promise.all([
		ref.update(data),
		historyRef.set({
			date: now,
			next,
			rating,
			elapsed: 0,
			viewTime
		})
	])
	
	return false
}

const updateExistingCard: UpdateCard = async (userData, ref, now, rating, viewTime) => {
	const isCorrect = Algorithm.isPerformanceRatingCorrect(rating)
	const mastered = rating === PerformanceRating.Easy && (userData.streak >= Algorithm.MASTERED_STREAK - 1)
	const historyRef = ref.collection('history').doc()
	const { e, next } = Algorithm.nextDueDate(rating, userData, now)
	
	const data: Record<string, any> = {
		due: next,
		totalCount: admin.firestore.FieldValue.increment(1),
		correctCount: admin.firestore.FieldValue.increment(Number(isCorrect)),
		streak: isCorrect ? admin.firestore.FieldValue.increment(1) : 0,
		e,
		mastered,
		last: {
			id: historyRef.id,
			date: now,
			next
		}
	}
	
	switch (rating) {
		case PerformanceRating.Easy:
			data.easyCount = admin.firestore.FieldValue.increment(1)
			break
		case PerformanceRating.Struggled:
			data.struggledCount = admin.firestore.FieldValue.increment(1)
			break
		case PerformanceRating.Forgot:
			data.forgotCount = admin.firestore.FieldValue.increment(1)
			break
	}
	
	await Promise.all([
		ref.update(data),
		historyRef.set({
			date: now,
			next,
			rating,
			elapsed: userData.last
				? now.getTime() - userData.last.date.getTime()
				: 0,
			viewTime
		})
	])
	
	return mastered && !userData.isMastered
}
