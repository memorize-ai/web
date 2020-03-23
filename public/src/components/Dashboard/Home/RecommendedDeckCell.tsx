import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import useImageUrl from '../../../hooks/useImageUrl'

export default ({ deck }: { deck: Deck }) => {
	const imageUrl = useImageUrl(deck)
	
	return (
		<Link to={`/d/${deck.id}`}>
			{imageUrl && <img src={imageUrl} alt={deck.name} />}
			<h1 className="name">{deck.name}</h1>
			<p className="subtitle">{deck.subtitle}</p>
		</Link>
	)
}
