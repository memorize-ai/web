import React from 'react'

import Deck from '../../../models/Deck'
import useSections from '../../../hooks/useSections'
import Header from './SectionHeader'
import Cards from './Cards'

export default ({ deck }: { deck: Deck }) => {
	const sections = [deck.unsectionedSection, ...useSections(deck)]
	
	return (
		<div className="sections">
			{sections.map(section => (
				<div key={section.id}>
					<Header deck={deck} section={section} />
					<Cards deck={deck} section={section} />
				</div>
			))}
		</div>
	)
}
