import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as Twitter from 'twitter'
import stripHtml = require('string-strip-html')

import Deck from '../Deck'
import Section from '../Section'
import Card from '../Card'
import User from '../User'
import Topic from '../Topic'

const firestore = admin.firestore()

export interface Fact {
	deck: Deck
	section: Section | null
	card: Card
	creator: User
	topics: Topic[]
}

const twitter = new Twitter(
	functions.config().twitter.card_poster
)

const factToTweetBody = ({ deck, section, card, creator, topics }: Fact) =>
	`${
		deck.name
	} by ${
		creator.name
	}${
		section ? ` (${section.name})` : ''
	}\n\n${
		stripHtml(card.front)
	}\n\n${
		stripHtml(card.back)
	}\n\n${
		topics
			.map(({ name }) => `#${name.replace(/\s+/g, '').toLowerCase()}`)
			.join(' ')
	}\n\n${
		deck.url
	}`

export const sendFact = (fact: Fact) =>
	twitter.post('statuses/update', {
		status: factToTweetBody(fact)
	})

const getNextDeck = async () => {
	const { empty, docs } = await firestore
		.collection('decks')
		.where('canPostCard', '==', true)
		.orderBy('nextPostedCardIndex')
		.limit(1)
		.get()
	
	if (empty)
		throw new Error('Unable to find deck')
	
	return new Deck(docs[0])
}

const getNextCard = async (deck: Deck) => {
	const { empty, docs } = await firestore
		.collection(`decks/${deck.id}/cards`)
		.limit(deck.nextPostedCardIndex + 1)
		.get()
	
	if (empty)
		throw new Error('Unable to find card')
	
	return new Card(docs[docs.length - 1])
}

const getTopics = async (deck: Deck) => {
	const topics = await Promise.all(
		deck.topics.map(async topicId => {
			try {
				return new Topic(
					await firestore.doc(`topics/${topicId}`).get()
				)
			} catch (error) {
				console.error(error)
				return null
			}
		})
	)
	
	return topics.filter(topic => topic !== null) as Topic[]
}

export const getNextFact = async (): Promise<Fact> => {
	const deck = await getNextDeck()
	const card = await getNextCard(deck)
	
	const [section, creator, topics] = await Promise.all([
		card.isUnsectioned
			? null
			: Section.fromId(card.sectionId, deck.id),
		User.fromId(deck.creatorId),
		getTopics(deck)
	])
	
	return { deck, section, card, creator, topics }
}

export const sendNextFact = async () => {
	const fact = await getNextFact()
	
	return Promise.all([
		sendFact(fact),
		fact.deck.updateNextPostedCard()
	])
}
