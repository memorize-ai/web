import React from 'react'

import Deck from '../../../models/Deck'
import Base from './Base'
import Stars from '../Stars'

import '../../../scss/components/DeckCell/index.scss'

export default ({ deck }: { deck: Deck }) => {
	return (
		<Base className="default" deck={deck} href={`/d/${deck.id}`}>
			<div className="stats">
				<Stars rating={deck.averageRating} />
				<div className="divider" />
				<div className="divider" />
			</div>
		</Base>
	)
}
