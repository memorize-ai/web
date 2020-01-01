import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.firestore
	.document('users/{uid}/decks/{deckId}')
	.onUpdate(({ before, after }, { params: { deckId } }) =>
		Promise.all([
			Deck.updateRating(
				deckId,
				before.get('rating'),
				after.get('rating')
			),
			updateFavorites(deckId, before, after)
		])
	)

const updateFavorites = (
	deckId: string,
	before: FirebaseFirestore.DocumentSnapshot,
	after: FirebaseFirestore.DocumentSnapshot
): Promise<FirebaseFirestore.WriteResult | null> => {
	const isFavorite = after.get('favorite')
	
	return before.get('favorite') === isFavorite
		? Promise.resolve(null)
		: firestore.doc(`decks/${deckId}`).update({
			favoriteCount: admin.firestore.FieldValue.increment(isFavorite ? 1 : -1)
		})
}
