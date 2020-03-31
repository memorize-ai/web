import React from 'react'

import Deck from '../../../models/Deck'
import Base from './Base'

import '../../../scss/components/DeckCell/index.scss'

export default ({ deck }: { deck: Deck }) => {
	return (
		<Base deck={deck} href={`/d/${deck.id}`}></Base>
	)
}
