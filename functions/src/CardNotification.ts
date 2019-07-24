import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { flatten } from './Helpers'
import User from './User'
import Deck from './Deck'
import Card from './Card'
import Notification, { NotificationType } from './Notification'

const LAST_NOTIFICATION_DIFFERENCE = 14400000

const firestore = admin.firestore()

type UserNotificationData = { id: string, tokens: string[], decksDue: DeckNotificationData[], cardsDue: number }
type DeckNotificationData = { id: string, name: string, cardsDue: number }

export const sendDueCardNotifications = functions.pubsub.schedule('every 5 minutes').onRun(_context => {
	const now = Date.now()
	return firestore.collection('users').get().then(users =>
		Promise.all(users.docs.map(user =>
			getUser(user, now).then(userNotificationData =>
				userNotificationData.cardsDue
					? User.updateLastNotification(user.id).then(_writeResult =>
						userNotificationData
					)
					: userNotificationData
			)
		))
	).then(users => sendNotifications(users.filter(user => user.cardsDue)))
})

function getUser(user: FirebaseFirestore.DocumentSnapshot, date: number = Date.now()): Promise<UserNotificationData> {
	const decksDue: DeckNotificationData[] = []
	return User.getTokens(user.id).then(tokens =>
		(tokens.length
			? User.getLastNotificationDifference(user, date) < LAST_NOTIFICATION_DIFFERENCE
				? Promise.resolve(0)
				: firestore.collection(`users/${user.id}/decks`).where('hidden', '==', false).get().then(decks =>
					Promise.all(decks.docs.map(userDeck => {
						const deckId = userDeck.id
						return Deck.doc(deckId).get().then(deck =>
							Deck.collection(deckId, 'cards').listDocuments().then(cards => {
								const deckName: string | undefined = deck.get('name')
								const deckData = deckName ? { id: deckId, name: deckName, cardsDue: 0 } as DeckNotificationData : undefined
								return Promise.all(cards.map(emptyCard =>
									firestore.doc(`users/${user.id}/decks/${deckId}/cards/${emptyCard.id}`).get().then(card => {
										const isDue = Card.isDue(card, date)
										if (isDue && deckData) deckData.cardsDue++
										return (isDue ? 1 : 0) as number
									})
								)).then(values => {
									if (deckData && deckData.cardsDue)
										decksDue.push(deckData)
									return values
								})
							})
						)
					}))
				).then(values =>
					addAllNumbers(flatten(values, 2))
				)
			: Promise.resolve(0)
		).then(cardsDue => ({
			id: user.id,
			tokens,
			decksDue: decksDue.sort((a, b) => b.cardsDue - a.cardsDue),
			cardsDue
		}))
	)
}

function sendNotifications(users: UserNotificationData[]): Promise<admin.messaging.BatchResponse | null> {
	return Notification.sendAll(flatten(users.map(user => 
		user.tokens.map(token =>
			new Notification(
				token,
				`You have ${user.cardsDue} card${user.cardsDue === 1 ? '' : 's'} to review`,
				getNotificationMessage(user)
			).setType(NotificationType.cardsDue)
		)
	), 2))
}

function getNotificationMessage(user: UserNotificationData): string {
	const numberOfDecksDue = user.decksDue.length
	if (!numberOfDecksDue) return 'Click here to review'
	const has1DeckDue = numberOfDecksDue === 1
	const cardsDuePrefix = user.cardsDue === 1 ? '' : 's'
	return `${user.decksDue[0].name} ${has1DeckDue ? 'has' : `and ${numberOfDecksDue - 1} other deck${numberOfDecksDue === 2 ? '' : 's'} have`} ${user.cardsDue} card${cardsDuePrefix} for you to review`
}

function addAllNumbers(array: number[]): number {
	return array.reduce((acc, element) => acc + element, 0)
}