import * as functions from 'firebase-functions'

import User from './User'
import Deck from './Deck'

export const cardDraftCreated = functions.firestore.document('users/{uid}/cardDrafts/{draftId}').onCreate((_snapshot, context) =>
	User.updateLastActivity(context.params.uid)
)

export const cardDraftUpdated = functions.firestore.document('users/{uid}/cardDrafts/{draftId}').onUpdate((change, context) => {
	const snapshot = change.after
	const cardId: string | undefined = snapshot.get('card')
	return Promise.all([
		User.updateLastActivity(context.params.uid),
		cardId
			? Deck.doc(snapshot.get('deck') || '', `cards/${cardId}`).get().then(card =>
				snapshot.get('front') === card.get('front') && snapshot.get('back') === card.get('back')
					? snapshot.ref.delete()
					: Promise.resolve() as Promise<any>
			)
			: Promise.resolve()
	])
})

export const cardDraftDeleted = functions.firestore.document('users/{uid}/cardDrafts/{draftId}').onDelete((_snapshot, context) =>
	User.updateLastActivity(context.params.uid)
)