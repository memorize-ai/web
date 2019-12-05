import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'

const firestore = admin.firestore()

export default functions.firestore
	.document('users/{uid}/decks/{deckId}')
	.onUpdate(({ before, after }, { params: { deckId } }) => {
		const oldRating: number | undefined = before.get('rating')
		const newRating: number | undefined = after.get('rating')
		
		if (oldRating === newRating)
			return Promise.resolve()
		
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
	})
