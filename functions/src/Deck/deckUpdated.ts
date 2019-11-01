import * as functions from 'firebase-functions'

import Deck from './Deck'
import Topic from '../Topic/Topic'

export default functions.firestore.document('decks/{deckId}').onUpdate(({ after: snapshot }) => {
	const thisDeck = new Deck(snapshot)
	return Promise.all((snapshot.get('topics') as string[]).map(Topic.fromId)).then(topics =>
		Promise.all(topics.map(topic =>
			Promise.all(topic.topDecks.map(Deck.fromId)).then(topDecks => {
				for (const i of [...topDecks.keys()])
					if (thisDeck.compareTo(topDecks[i])) {
						topDecks.length === 10
							? topDecks[i] = thisDeck
							: topDecks.splice(i, 0, thisDeck)
						return topic.documentReference().update({ topDecks })
					}
				return Promise.resolve(null)
			})	
		))
	)
})
