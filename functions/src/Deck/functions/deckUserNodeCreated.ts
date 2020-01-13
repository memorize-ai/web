import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from '..'
import User from '../../User'
import Section from '../../Section'

const firestore = admin.firestore()

export default functions
	.runWith({ timeoutSeconds: 540, memory: '2GB' })
	.firestore
	.document('users/{uid}/decks/{deckId}').onCreate(({ ref }, { params: { uid, deckId } }) =>
		User.fromId(uid).then(user =>
			Promise.all([
				Deck.incrementCurrentUserCount(deckId),
				user.allDecks.includes(deckId)
					? Promise.resolve(null)
					: Deck.incrementAllTimeUserCount(deckId),
				user.addDeckToAllDecks(deckId),
				User.incrementDeckCount(uid),
				Deck.fromId(deckId).then(deck =>
					updateDueCardCounts(ref, deck, uid === deck.creatorId)
				),
				Deck.addUserToCurrentUsers(deckId, uid),
				Deck.addCardsToUserNode(deckId, uid)
			])
		)
	)

const updateDueCardCounts = async (
	ref: FirebaseFirestore.DocumentReference,
	deck: Deck,
	isOwner: boolean,
) => {
	const sections = await firestore
		.collection(`decks/${deck.id}/sections`)
		.get()
		.then(({ docs }) =>
			docs.map(doc => new Section(doc))
		)
	
	const updateObject: FirebaseFirestore.UpdateData = {
		unsectionedDueCardCount: deck.numberOfUnsectionedCards
	}
	
	if (isOwner)
		updateObject.sections = sections.reduce((acc, section) => ({
			...acc,
			[section.id]: section.numberOfCards
		}), {})
	
	return ref.update(updateObject)
}
