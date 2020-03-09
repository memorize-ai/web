import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Email, { EmailTemplate } from '../../Email'

const firestore = admin.firestore()

export default functions.pubsub.schedule('every 24 hours').onRun(async () => {
	const users = await firestore.collection('users').listDocuments()
	
	return Promise.all(users.map(async ({ id: uid }) => {
		const { docs: decks } = await firestore
			.collection(`users/${uid}/decks`)
			.where('dueCardCount', '>', 0)
			.get()
		
		return sendNotificationsIfNeeded(
			uid,
			decks.map(deck => ({
				id: deck.id,
				dueCardCount: deck.get('dueCardCount') ?? 0
			}))
		)
	}))
})

const sendNotificationsIfNeeded = async (uid: string, decks: { id: string, dueCardCount: number }[]) => {
	decks = decks.filter(deck => deck.dueCardCount)
	
	if (!decks.length)
		return
	
	decks = decks.sort(({ dueCardCount: a }, { dueCardCount: b }) => b - a)
	
	const user = await firestore.doc(`users/${uid}`).get()
	const dueCardCount = decks.reduce((acc, deck) => acc + deck.dueCardCount, 0)
	
	return Email.send({
		template: EmailTemplate.DueCardsReminder,
		to: user.get('email'),
		subject: `You have ${dueCardCount} card${dueCardCount === 1 ? '' : 's'} due`,
		context: {
			count: dueCardCount,
			is_plural: dueCardCount !== 1,
			name: user.get('name'),
			decks: await Promise.all(decks.map(async deck => ({
				name: (await firestore.doc(`decks/${deck.id}`).get()).get('name'),
				count: deck.dueCardCount,
				is_plural: deck.dueCardCount !== 1
			})))
		}
	})
}
