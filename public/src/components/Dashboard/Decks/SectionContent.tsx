import React from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import SectionHeader from '../../shared/SectionHeader'
import useCards from '../../../hooks/useCards'
import CardCell from '../../shared/CardCell'
import Loader from '../../shared/Loader'

export default (
	{ deck, section, isExpanded, toggleExpanded }: {
		deck: Deck
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
	}
) => {
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div>
			<SectionHeader
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
			/>
			{isExpanded && (
				cards
					? (
						<div className="cards">
							{cards.map(card => (
								<CardCell key={card.id} card={card} />
							))}
						</div>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
			)}
		</div>
	)
}
