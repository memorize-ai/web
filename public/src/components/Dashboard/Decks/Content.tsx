import React from 'react'

import Deck from '../../../models/Deck'
import Header from './Header'
import Sections from './Sections'

export default ({ deck }: { deck: Deck }) => (
	<>
		<Header deck={deck} />
		<Sections deck={deck} />
	</>
)
