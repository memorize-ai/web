import React from 'react'

import Deck from '../../../models/Deck'
import useSections from '../../../hooks/useSections'
import Header from './SectionHeader'

export default ({ deck }: { deck: Deck }) => {
	const sections = useSections(deck)
	
	return (
		<div className="sections">
			{sections.map(section => (
				<div key={section.id}>
					<Header deck={deck} section={section} />
				</div>
			))}
		</div>
	)
}
