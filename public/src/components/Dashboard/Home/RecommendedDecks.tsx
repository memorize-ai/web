import React from 'react'

import Deck from '../../../models/Deck'
import RecommendedDeckCell from './RecommendedDeckCell'

export default ({ decks }: { decks: Deck[] }) => (
	<>
		<h1>Recommended decks</h1>
		<div className="recommended-decks">
			{decks.map(deck => (
				<RecommendedDeckCell key={deck.id} deck={deck} />
			))}
		</div>
	</>
)
