import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Algorithm from './Algorithm'

const firestore = admin.firestore()

function allCards(uid: string): Promise<{ id: string, intervals: number[], front: string }[]> {
	return firestore.collection(`users/${uid}/decks`).get().then(decks =>
		Promise.all(decks.docs.map(deck =>
			allCardsForDeck(uid, deck.id)
		)).then(lists => lists.flat())
	)
}

function allCardsForDeck(uid: string, deckId: string): Promise<{ id: string, intervals: number[], front: string }[]> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards`).get().then(cards =>
		Promise.all(cards.docs.map(card =>
			allHistory(uid, deckId, card.id)
		))
	)
}

function allHistory(uid: string, deckId: string, cardId: string): Promise<{ id: string, intervals: number[], front: string }> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards/${cardId}/history`).get().then(historyDocs =>
		Promise.all(historyDocs.docs.map(history => history.data().elapsed as number))
	).then(intervals =>
		firestore.doc(`decks/${deckId}/cards/${cardId}`).get().then(cardDoc =>
			({ id: cardId, intervals, front: cardDoc.data()!.front })
		)
	)
}

const historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const current = new Date()
	const now = Date.now()
	const cardRef = firestore.doc(`users/${context.params.uid}/decks/${context.params.deckId}/cards/${context.params.cardId}`)
	return cardRef.get().then(card => {
		const cardData = card.data()
		const rating = snapshot.data()!.rating
		const correct = rating > 2
		const increment = correct ? 1 : 0
		if (cardData)
			return firestore.doc(`users/${context.params.uid}`).get().then(user =>
				allCards(context.params.uid).then(cards => {
					const next = new Date(Algorithm.predict(context.params.cardId, cards))
					const elapsed = now - user.data()!.last.elapsed
					const streak = correct ? cardData.streak + 1 : 0
					return Promise.all([
						cardRef.collection('history').doc(context.params.historyId).update({
							date: current,
							next,
							elapsed
						}),
						cardRef.update({
							count: admin.firestore.FieldValue.increment(1),
							correct: admin.firestore.FieldValue.increment(increment),
							streak,
							mastered: rating === 5 && streak >= 20,
							last: {
								id: context.params.historyId,
								date: current,
								rating,
								elapsed
							},
							next
						})
					])
				})
			)
		else {
			const next = new Date(now + rating < 3 ? 0 : 86400000)
			return Promise.all([
				cardRef.collection('history').doc(context.params.historyId).update({
					date: current,
					next,
					elapsed: 0
				}),
				cardRef.set({
					count: 1,
					correct: increment,
					e: 2.5,
					streak: increment,
					mastered: false,
					last: {
						id: context.params.historyId,
						date: current,
						rating,
						elapsed: 0
					},
					next
				})
			])
		}
	})
})

export { historyCreated }