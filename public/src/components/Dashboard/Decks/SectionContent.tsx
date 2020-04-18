import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import SectionHeader from '../../shared/SectionHeader/Owned'
import useCards from '../../../hooks/useCards'
import CardCell from '../../shared/CardCell'
import Loader from '../../shared/Loader'

export default (
	{ deck, section, isExpanded, toggleExpanded, setSelectedSection }: {
		deck: Deck
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
		setSelectedSection: (action: 'share' | 'unlock') => void
	}
) => {
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div>
			<SectionHeader
				deck={deck}
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
				onUnlock={() => setSelectedSection('unlock')}
				onShare={() => setSelectedSection('share')}
			/>
			<Link to={`/decks/${deck.slug}/add${section.isUnsectioned ? '' : `/${section.id}`}`}>
				Add cards
			</Link>
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
