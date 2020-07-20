import React, { useCallback } from 'react'

import Deck from '../../../models/Deck'
import useSimilarDecks from '../../../hooks/useSimilarDecks'
import DeckCell from '../../shared/DeckCell'
import { formatNumber } from '../../../utils'

export const SIMILAR_DECKS_CHUNK_SIZE = 10

const DeckPageSimilarDecks = ({ deck }: { deck: Deck }) => {
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)
	
	const withFilter = useCallback((filter: (i: number) => any) => (
		similarDecks
			?.filter((_, i) => filter(i))
			.map(deck => (
				<DeckCell key={deck.id} deck={deck} />
			))
	), [similarDecks])
	
	return similarDecks && (
		<div id="similar" className="similar-decks">
			<h2 className="title">
				We think you'd like... <span>({formatNumber(similarDecks.length)})</span>
			</h2>
			<div className="rows">
				<div>{withFilter(i => !(i & 1))}</div>
				<div>{withFilter(i => i & 1)}</div>
			</div>
		</div>
	)
}

export default DeckPageSimilarDecks
