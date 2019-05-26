import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from './Deck'

const firestore = admin.firestore()

export enum CardRating {
	like = 1,
	none = 0,
	dislike = -1
}

export default class Card {
	static updateRating(id: string, { from, to }: { from: CardRating, to: CardRating }): Promise<any> {
		
	}
}

export const rateCard = functions.https.onCall((data, context) => {
	const rating = data.rating
	const ratingData = { rating, review: data.review }
	const ratingDoc = firestore.doc(`users/${context.auth!.uid}/ratings/${data.deckId}`)
	return ratingDoc.get().then(oldRating =>
		Promise.all([
			ratingDoc.set(ratingData),
			Deck.doc(data.deckId, `users/${context.auth!.uid}`).update(ratingData),
			Deck.updateRating(data.deckId, { from: oldRating.get('rating'), to: rating })
		])
	)
})

export const cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, true)
)

export const cardDeleted = functions.firestore.document('decks/{deckId}/cards/{cardId}').onDelete((_snapshot, context) =>
	Deck.updateCount(context.params.deckId, false)
)