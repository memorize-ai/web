import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { EMAIL_SCHEDULE } from '../../constants'
import Email, { EmailTemplate } from '../../Email'

const firestore = admin.firestore()

export default functions.pubsub.schedule(EMAIL_SCHEDULE).onRun(async () => {
	const { docs: users } = await firestore
		.collection('users')
		.where(`unsubscribed.${EmailTemplate.DueCards}`, '==', false)
		.get()
	
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
		template: EmailTemplate.DueCards,
		to: user.get('email'),
		subject: `You have ${dueCardCount} card${dueCardCount === 1 ? '' : 's'} due`,
		context: {
			count: dueCardCount,
			is_plural: dueCardCount !== 1,
			name: user.get('name'),
			decks: await Promise.all(decks.map(async deck => {
				const snapshot = await firestore.doc(`decks/${deck.id}`).get()
				
				return {
					name: snapshot.get('name'),
					count: deck.dueCardCount,
					is_plural: deck.dueCardCount !== 1,
					url: `https://memorize.ai/decks/${snapshot.get('slug')}`
				}
			})),
			time_sent: '12:00 PM PST',
			unsubscribe_url: `https://memorize.ai/unsubscribe/${uid}/${EmailTemplate.DueCards}`
		}
	})
}
