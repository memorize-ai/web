import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../models/Deck'
import useImageUrl from '../../hooks/useImageUrl'

export default ({ deck }: { deck: Deck }) => {
	const imageUrl = useImageUrl(deck)
	
	return (
		<Link to={`/decks/${deck.id}`}>
			{imageUrl && <img src={imageUrl} alt={deck.name} />}
			<p className="title">
				{deck.name}
			</p>
			<p className="badge">
				{deck.userData?.numberOfDueCards}
			</p>
		</Link>
	)
}
