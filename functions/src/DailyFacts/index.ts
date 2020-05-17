import * as functions from 'firebase-functions'
import * as Twitter from 'twitter'

import Deck from '../Deck'
import Card from '../Card'

export default class DailyFacts {
	private static twitter = new Twitter(
		functions.config().twitter.dailyfacts
	)
	
	private static factToTweetBody = (fact: Fact) =>
		`${fact.deck.url}`
	
	static send = (fact: Fact) =>
		DailyFacts.twitter.post('statuses/update', {
			status: DailyFacts.factToTweetBody(fact)
		})
	
	static getNext = async () => ({
		deck: await Deck.fromId('100076820'),
		card: await Card.fromId('0dovrdV223WXbyFCA40l', '100076820')
	} as Fact)
	
	static sendNext = async () =>
		DailyFacts.send(await DailyFacts.getNext())
}

export interface Fact {
	deck: Deck
	card: Card
}
