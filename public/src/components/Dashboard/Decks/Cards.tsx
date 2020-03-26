import React from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useExpandedSections from '../../../hooks/useExpandedSections'

export default ({ deck, section }: { deck: Deck, section: Section }) => {
	const [isExpanded, toggleExpanded] = useExpandedSections(deck)
	
	return (
		<div className="cards">
			
		</div>
	)
}
