import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.firestore
	.document('users/{uid}/decks/{deckId}')
	.onUpdate(({ before, after }, { params: { deckId } }) =>
		Promise.all([
			updateRating(deckId, before, after),
			updateFavorites(deckId, before, after)
		])
	)

const updateRating = (
	deckId: string,
	before: FirebaseFirestore.DocumentSnapshot,
	after: FirebaseFirestore.DocumentSnapshot
): Promise<FirebaseFirestore.WriteResult | null> => {
	const oldRating: number | undefined = before.get('rating')
	const newRating: number | undefined = after.get('rating')
	
	if (oldRating === newRating)
		return Promise.resolve(null)
	
	const { FieldValue } = admin.firestore
	
	const documentReference = firestore.doc(`decks/${deckId}`)
	const updateData: FirebaseFirestore.UpdateData = {}
	
	oldRating
		? updateData[Deck.fieldNameForRating(oldRating)] = FieldValue.increment(-1)
		: updateData.ratingCount = FieldValue.increment(1)
	
	newRating
		? updateData[Deck.fieldNameForRating(newRating)] = FieldValue.increment(1)
		: updateData.ratingCount = FieldValue.increment(-1)
	
	return documentReference.update(updateData)
}

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
