import React from 'react'

import Deck from '../../../models/Deck'
import Sections from './Sections'

export default ({ deck }: { deck: Deck }) => (
	<>
		<h1>{deck.name}</h1>
		<Sections deck={deck} />
	</>
)
