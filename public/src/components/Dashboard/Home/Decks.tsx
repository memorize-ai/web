import React from 'react'

import useDecks from '../../../hooks/useDecks'
import OwnedDeckCell from './OwnedDeckCell'

export default () => {
	return (
		<>
			<h1>My decks</h1>
			<div className="decks">
				{useDecks().map(deck => (
					<OwnedDeckCell key={deck.id} deck={deck} />
				))}
			</div>
		</>
	)
}
