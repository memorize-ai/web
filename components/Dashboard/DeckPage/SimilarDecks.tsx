import { useCallback } from 'react'

import Deck from 'models/Deck'
import DeckCell from 'components/DeckCell'
import { formatNumber } from 'lib/utils'

const evenFilter = (i: number) => !(i & 1)
const oddFilter = (i: number) => !!(i & 1)

export interface DeckPageSimilarDecksProps {
	similarDecks: Deck[] | null
}

const DeckPageSimilarDecks = ({ similarDecks }: DeckPageSimilarDecksProps) => {
	const withFilter = useCallback((filter: (i: number) => any) => {
		if (!similarDecks)
			return null
		
		return similarDecks
			.filter((_, i) => filter(i))
			.map(deck => <DeckCell key={deck.id} deck={deck} />)
	}, [similarDecks])
	
	if (!similarDecks)
		return null
	
	return (
		<div id="similar" className="similar-decks">
			<h2 className="title">
				We think you'd like... <span>({formatNumber(similarDecks.length)})</span>
			</h2>
			<div className="rows">
				<div>{withFilter(evenFilter)}</div>
				<div>{withFilter(oddFilter)}</div>
			</div>
		</div>
	)
}

export default DeckPageSimilarDecks
