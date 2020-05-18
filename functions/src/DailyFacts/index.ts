import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as Twitter from 'twitter'
import stripHtml = require('string-strip-html')

import Deck from '../Deck'
import Section from '../Section'
import Card from '../Card'
import User from '../User'

const firestore = admin.firestore()

export interface Fact {
	deck: Deck
	section: Section | null
	card: Card
	creator: User
}

const twitter = new Twitter(
	functions.config().twitter.dailyfacts
)

const factToTweetBody = ({ deck, section, card, creator }: Fact) =>
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
	}\n${
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

export const getNextFact = async (): Promise<Fact> => {
	const deck = await getNextDeck()
	const card = await getNextCard(deck)
	
	const [section, creator] = await Promise.all([
		card.isUnsectioned
			? null
			: Section.fromId(card.sectionId, deck.id),
		User.fromId(deck.creatorId)
	])
	
	return { deck, section, card, creator }
}

export const sendNextFact = async () => {
	const fact = await getNextFact()
	
	await Promise.all([
		sendFact(fact),
		fact.deck.updateNextPostedCard()
	])
}
