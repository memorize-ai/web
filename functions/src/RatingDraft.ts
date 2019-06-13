import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Deck from './Deck'

export const ratingDraftCreated = functions.firestore.document('users/{uid}/ratingDrafts/{draftId}').onCreate((_snapshot, context) =>
	User.updateLastActivity(context.params.uid)
)

export const ratingDraftUpdated = functions.firestore.document('users/{uid}/ratingDrafts/{draftId}').onUpdate((change, context) => {
	const snapshot = change.after
	const deleteSnapshot = snapshot.ref.delete
	const handleField = (data_: FirebaseFirestore.DocumentData, field: string) =>
		data_[field] ? Promise.resolve() as Promise<any> : snapshot.ref.update({ [field]: admin.firestore.FieldValue.delete() })
	const data = snapshot.data()
	return Promise.all([
		User.updateLastActivity(context.params.uid),
		data
			? !(data.rating || data.review)
				? deleteSnapshot()
				: Promise.all([
					handleField(data, 'rating'),
					handleField(data, 'review'),
					Deck.doc(snapshot.id, `users/${context.params.uid}`).get().then(user =>
						snapshot.get('rating') === user.get('rating') && snapshot.get('review') === user.get('review')
							? deleteSnapshot()
							: Promise.resolve() as Promise<any>
					)
				])
			: deleteSnapshot() as Promise<any>
	])
})

export const ratingDraftDeleted = functions.firestore.document('users/{uid}/ratingDrafts/{draftId}').onDelete((_snapshot, context) =>
	User.updateLastActivity(context.params.uid)
)