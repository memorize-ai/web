import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'

export default ({ deck }: { deck: Deck }) => (
	<Link to={`/d/${deck.id}`}>
		<h1 className="name">{deck.name}</h1>
		<p className="subtitle">{deck.subtitle}</p>
	</Link>
)
