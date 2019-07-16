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
			User.getLastNotificationDifference(user, now) < LAST_NOTIFICATION_DIFFERENCE
				? Promise.resolve() as Promise<any>
				: firestore.collection(`users/${user.id}/decks`).get().then(decks =>
					Promise.all(decks.docs.filter(deck => !deck.get('hidden')).map(deck =>
						Deck.collection(deck.id, 'cards').listDocuments().then(cards =>
							Promise.all(cards.map(emptyCard =>
								firestore.doc(`users/${user.id}/decks/${deck.id}/cards/${emptyCard.id}`).get().then(card =>
									(Card.isDue(card, now) ? 1 : 0) as number
								)
							))
						)
					))
				).then(values => {
					const cardsDue = values.flat().reduce((acc, element) => acc + element, 0)
					return cardsDue
						? Notification.sendAll(user)
						? Notification.send(new Notification(user.))
						: Promise.resolve()
				})
		))
	)
})


// export const checkDueCards = functions.pubsub.schedule('every 15 minutes').onRun(_context =>
// 	firestore.collection('users').get().then(users =>
// 		Promise.all(users.docs.map(user =>
// 			Date.now() - user.data().lastNotification < 21600000
// 				? Promise.resolve([])
// 				: firestore.collection(`users/${user.id}/decks`).get().then(decks =>
// 					Promise.all(decks.docs.map(deck =>
// 						firestore.collection(`users/${user.id}/decks/${deck.id}/cards`).get().then(cards =>
// 							Promise.resolve(cards.docs.filter(card => Date.now() <= card.data().next.toMillis()).length)
// 						)
// 					))
// 				).then(results => {
// 					const count = results.reduce((acc, element) => acc + element)
// 					console.log(count)
// 					return Promise.all(count
// 						? [
// 							firestore.doc(`users/${user.id}`).update({ lastNotification: Date.now() }),
// 							sendCardNotification(user.id, count)
// 						]
// 						: [
// 							Promise.resolve()
// 						]
// 					)
// 				})
// 			)
// 		)
// 	)
// )

// function sendCardNotification(uid: string, count: number): Promise<any> {
// 	return firestore.collection(`users/${uid}/tokens`).get().then(tokens => {
// 		const validTokens = tokens.docs.filter(element => element.data().enabled).map(element => element.id)
// 		return validTokens.length === 0
// 			? Promise.resolve(null)
// 			: messaging.sendToDevice(validTokens, {
// 				notification: {
// 					title: 'Review time!',
// 					body: `You have ${count} card${count === 1 ? '' : 's'} to review`,
// 					icon: 'https://memorize.ai/images/logo.png'
// 				}
// 			})
// 	})
// }