import React from 'react'

import Deck from '../../../models/Deck'

import '../../../scss/components/DeckCell/Owned.scss'

export default ({ deck }: { deck: Deck }) => {
	return (
		<>{deck.name}</>
	)
}
