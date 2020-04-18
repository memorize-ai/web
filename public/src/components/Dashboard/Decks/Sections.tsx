import React from 'react'

import Deck from '../../../models/Deck'
import useSections from '../../../hooks/useSections'
import useExpandedSections from '../../../hooks/useExpandedSections'
import SectionContent from './SectionContent'

export default ({ deck }: { deck: Deck }) => {
	const sections = useSections(deck.id)
	const [isExpanded, toggleExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})
	
	return (
		<>
			{sections.map(section => (
				<SectionContent
					deck={deck}
					key={section.id}
					section={section}
					isExpanded={isExpanded(section.id)}
					toggleExpanded={() => toggleExpanded(section.id)}
				/>
			))}
		</>
	)
}
