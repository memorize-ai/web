import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from './Deck'
import Setting from './Setting'
import Algorithm, { CardTrainingData } from './Algorithm'
import SM2, { DEFAULT_E } from './SM2'
import User from './User'
import Reputation, { ReputationAction } from './Reputation'
import { CardLast } from './Card'
import { flatten } from './Helpers'

const firestore = admin.firestore()

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
			const rating: number = snapshot.get('rating') || 5
			const correct = rating > 2
			const increment = correct ? 1 : 0
			if (card.exists)
				return Setting.get<boolean>('algorithm', uid).then(algorithm => {
					const last: CardLast | undefined = card.get('last')
					const elapsed = now - (last ? last.date.toMillis() : now)
					const streak = correct ? (card.get('streak') || 0) + 1 : 0
					const e = SM2.e(card.get('e') || DEFAULT_E, rating)
					if (algorithm)
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
					else {
						const next = new Date(now + SM2.interval(e, streak) * 86400000)
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
					}
				})
			else {
				const next = new Date(now + (rating < 3 ? 0 : 86400000))
				return Promise.all([
					cardRef.collection('history').doc(historyId).update({
						date: current,
						next,
						elapsed: 0
					}),
					cardRef.set({
						count: 1,
						correct: increment,
						e: DEFAULT_E,
						streak: increment,
						mastered: false,
						last: {
							id: historyId,
							date: current,
							rating,
							elapsed: 0
						},
						next
					})
				])
			}
		}),
		User.updateLastActivity(uid),
		Deck.doc(deckId).get().then(deck =>
			Reputation.push(uid, ReputationAction.everyCardReviewed, `You reviewed a card in ${deck.get('name') || 'Unknown deck'}`, { deckId })
		),
		Deck.doc(deckId, `cards/${cardId}`).update({ reviews: admin.firestore.FieldValue.increment(1) })
	])
})

function allCards(uid: string): Promise<CardTrainingData[]> {
	return firestore.collection(`users/${uid}/decks`).get().then(decks =>
		Promise.all(decks.docs.map(deck =>
			allCardsForDeck(uid, deck.id)
		)).then(lists => flatten(lists))
	)
}

function allCardsForDeck(uid: string, deckId: string): Promise<CardTrainingData[]> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards`).get().then(cards =>
		Promise.all(cards.docs.map(card =>
			allHistory(uid, deckId, card.id)
		))
	)
}

function allHistory(uid: string, deckId: string, cardId: string): Promise<CardTrainingData> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards/${cardId}/history`).get().then(historyDocs =>
		Promise.all(historyDocs.docs.map(history => history.get('elapsed') as number || 0))
	).then(intervals =>
		Deck.doc(deckId, `cards/${cardId}`).get().then(cardDoc =>
			({ id: cardId, intervals, front: cardDoc.get('front') || '' })
		)
	)
}