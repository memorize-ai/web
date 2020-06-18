import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { sendEmail, EmailTemplate, EmailOptions } from '..'
import User from '../../User'
import Deck from '../../Deck'
import DeckUserData from '../../Deck/UserData'

const EMAIL_TEMPLATE = EmailTemplate.DueCardsNotification

const firestore = admin.firestore()

// Every Monday at 12:00 PM
export default functions.pubsub.schedule('0 12 * * 1').onRun(async () => {
	const { docs: userSnapshots } = await firestore
		.collection('users')
		.where(`unsubscribed.${EMAIL_TEMPLATE}`, '==', false)
		.get()
	
	return sendEmail(
		(await getEmailOptions(userSnapshots))
			.filter(Boolean) as EmailOptions[]
	)
})

const getEmailOptions = (
	userSnapshots: FirebaseFirestore.DocumentSnapshot[]
): Promise<(EmailOptions | null)[]> =>
	Promise.all(userSnapshots.map(async userSnapshot => {
		try {
			const user = new User(userSnapshot)
			
			const { empty, docs: deckSnapshots } = await firestore
				.collection(`users/${user.id}/decks`)
				.where('dueCardCount', '>', 0)
				.get()
			
			if (empty)
				return null
			
			return {
				template: EMAIL_TEMPLATE,
				to: {
					name: user.name,
					email: user.email
				},
				...await getData(
					user,
					deckSnapshots.filter(({ exists }) => exists)
				)
			}
		} catch (error) {
			console.error(error)
			return null
		}
	}))

const getData = async (
	user: User,
	deckSnapshots: FirebaseFirestore.DocumentSnapshot[]
) => {
	const deckUserDataItems = deckSnapshots
		.map(snapshot => new DeckUserData(snapshot))
	
	const totalNumberOfDueCards = deckUserDataItems
		.reduce((acc, { numberOfDueCards }) => (
			acc + numberOfDueCards
		), 0)
	
	const decks = await Promise.all(
		deckUserDataItems
			.sort((a, b) => b.numberOfDueCards - a.numberOfDueCards)
			.map(async ({ id, numberOfDueCards, sections }) => {
				try {
					const deck = await Deck.fromId(id)
					
					const numberOfDueSections =
						Object.values(sections).reduce((acc, count) => (
							acc + (count > 0 ? 1 : 0)
						), 0)
					
					return {
						url: `https://memorize.ai/decks/${deck.slugId}/${deck.slug}`,
						image_url: deck.imageUrl ?? Deck.defaultImageUrlJpeg,
						name: deck.name,
						card_due_count: numberOfDueCards,
						card_due_count_is_one: numberOfDueCards === 1,
						section_due_count: numberOfDueSections,
						section_due_count_is_one: numberOfDueSections === 1
					}
				} catch (error) {
					console.error(error)
					return null
				}
			})
	)
	
	return {
		subject: `You have ${
			totalNumberOfDueCards
		} card${
			totalNumberOfDueCards === 1 ? '' : 's'
		} due`,
		context: {
			url: 'https://memorize.ai',
			frequency: 'weekly',
			user: {
				name: user.name,
				card_due_count: totalNumberOfDueCards,
				card_due_count_is_one: totalNumberOfDueCards === 1
			},
			decks: decks.filter(Boolean)
		}
	}
}
