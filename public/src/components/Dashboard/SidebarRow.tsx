import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../models/Deck'

export default ({ deck }: { deck: Deck }) => (
	<Link to={`/decks/${deck.id}`}>
		<p className="title">
			{deck.name}
		</p>
		<p className="badge">
			{deck.userData?.numberOfDueCards}
		</p>
	</Link>
)
