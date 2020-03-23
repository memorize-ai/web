import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import useImageUrl from '../../../hooks/useImageUrl'

export default ({ deck }: { deck: Deck }) => {
	const imageUrl = useImageUrl(deck)
	
	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0
	
	return (
		<Link to={`/decks/${deck.id}`}>
			{imageUrl && <img src={imageUrl} alt={deck.name} />}
			<h1 className="name">{deck.name}</h1>
			<p className="due-cards-message">
				{numberOfDueCards} card{numberOfDueCards === 1 ? '' : 's'} due
			</p>
		</Link>
	)
}
