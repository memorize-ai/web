import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Section from '../../Section'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 1 minutes').onRun(() =>
	firestore.collection('users').listDocuments().then(users =>
		Promise.all(users.map(({ id: uid }) =>
			firestore.collection(`users/${uid}/decks`).get().then(({ docs: decks }) =>
				Promise.all(decks.map(userData =>
					updateDueCardCounts(uid, userData)
				))
			)
		))
	)
)

const updateDueCardCounts = async (uid: string, deckUserData: FirebaseFirestore.DocumentSnapshot) => {
	const deckId = deckUserData.id
	
	const dueCards = await getDueCards(uid, deckId)
	
	const cardCountOfSection = (sectionId: string) =>
		dueCards.reduce((acc, card) =>
			acc + (card.get('section') === sectionId ? 1 : 0)
		, 0)
	
	return firestore.doc(`users/${uid}/decks/${deckId}`).update({
		dueCardCount: dueCards.length,
		unsectionedDueCardCount: cardCountOfSection(Section.unsectionedId),
		sections: Object.keys(deckUserData.get('sections') ?? {}).reduce((acc, sectionId) => ({
			...acc,
			[sectionId]: cardCountOfSection(sectionId)
		}), {})
	})
}

const getDueCards = (uid: string, deckId: string) =>
	firestore
		.collection(`users/${uid}/decks/${deckId}/cards`)
		.where('due', '<=', new Date)
		.get()
		.then(({ docs }) => docs)
