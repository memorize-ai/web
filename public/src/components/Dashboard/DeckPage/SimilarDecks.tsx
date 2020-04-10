import React from 'react'

import Deck from '../../../models/Deck'
import useSimilarDecks from '../../../hooks/useSimilarDecks'

export const SIMILAR_DECKS_CHUNK_SIZE = 10

export default ({ deck }: { deck: Deck }) => {
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)
	
	return (
		<div className="similar-decks">
			{similarDecks.map(deck => (
				<p key={deck.id}>
					{deck.name}
				</p>
			))}
		</div>
	)
}
