import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Deck from './Deck'
import Card from './Card'
import Notification from './Notification'

const LAST_NOTIFICATION_DIFFERENCE = 86400000

const firestore = admin.firestore()

export const checkDueCards = functions.pubsub.schedule('every 15 minutes').onRun(context => {
	const now = Date.now()
	return firestore.collection('users').get().then(users =>
		Promise.all(users.docs.map(user =>
			getUser(user, now).then(userDetails =>
				userDetails.cardsDue
					? User.updateLastNotification(user.id).then(_writeResult =>
						userDetails
					)
					: userDetails
			)
		))
	).then(sendNotifications)
})

function getUser(user: FirebaseFirestore.DocumentSnapshot, date: number = Date.now()): Promise<{ uid: string, tokens: string[], decksDue: number, cardsDue: number }> {
	const decksDue = new Set<string>()
	return User.getTokens(user.id).then(tokens =>
		(tokens.length
			? User.getLastNotificationDifference(user, date) < LAST_NOTIFICATION_DIFFERENCE
				? Promise.resolve(0)
				: firestore.collection(`users/${user.id}/decks`).get().then(decks =>
					Promise.all(decks.docs.filter(deck => !deck.get('hidden')).map(deck =>
						Deck.collection(deck.id, 'cards').listDocuments().then(cards =>
							Promise.all(cards.map(emptyCard =>
								firestore.doc(`users/${user.id}/decks/${deck.id}/cards/${emptyCard.id}`).get().then(card => {
									const isDue = Card.isDue(card, date)
									if (isDue) decksDue.add(deck.id)
									return (isDue ? 1 : 0) as number
								})
							))
						)
					))
				).then(values =>
					values.flat().reduce((acc, element) => acc + element, 0)
				)
			: Promise.resolve(0)
		).then(cardsDue => ({
			uid: user.id,
			tokens,
			decksDue: decksDue.size,
			cardsDue
		}))
	)
}

function sendNotifications(users: { uid: string, tokens: string[], decksDue: number, cardsDue: number }[]): Promise<admin.messaging.BatchResponse> {
	return Notification.sendAll(users.map(user => 
		user.tokens.map(token =>
			new Notification(token, `You have ${user.cardsDue} card${user.cardsDue === 1 ? '' : 's'} to review`, `You have ${user.cardsDue} card${user.cardsDue === 1 ? '' : 's'} to review in ${user.decksDue} deck${user.decksDue === 1 ? '' : 's'}`)
		)
	).flat())
}