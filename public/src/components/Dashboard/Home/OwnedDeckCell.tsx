import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'

export default ({ deck }: { deck: Deck }) => {
	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0
	
	return (
		<Link to={`/decks/${deck.id}`}>
			<h1 className="name">{deck.name}</h1>
			<p className="due-cards-message">
				{numberOfDueCards} card{numberOfDueCards === 1 ? '' : 's'} due
			</p>
		</Link>
	)
}
