import React from 'react'

import Deck from '../../../models/Deck'
import useSimilarDecks from '../../../hooks/useSimilarDecks'

export const SIMILAR_DECKS_CHUNK_SIZE = 10

export default ({ deck }: { deck: Deck }) => {
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)
	
	return (
		<div className="similar-decks">
			<h2 className="title">
				We think you'd like... <span>({similarDecks.length})</span>
			</h2>
			<div className="box">
				
			</div>
		</div>
	)
}
