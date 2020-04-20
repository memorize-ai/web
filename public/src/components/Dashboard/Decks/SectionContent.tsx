import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useCurrentUser from '../../../hooks/useCurrentUser'
import SectionHeader from '../../shared/SectionHeader/Owned'
import useCards from '../../../hooks/useCards'
import CardCell from '../../shared/CardCell/Owned'
import Loader from '../../shared/Loader'

export default (
	{ deck, section, isExpanded, toggleExpanded, setSelectedSection, numberOfSections, reorder }: {
		deck: Deck
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
		setSelectedSection: (action: 'share' | 'unlock') => void
		numberOfSections: number
		reorder: (delta: number) => void
	}
) => {
	const [currentUser] = useCurrentUser()
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div className="section">
			<SectionHeader
				deck={deck}
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
				onUnlock={() => setSelectedSection('unlock')}
				onShare={() => setSelectedSection('share')}
				numberOfSections={numberOfSections}
				reorder={reorder}
			/>
			{currentUser?.id === deck.creatorId && (
				<Link to={`/decks/${deck.slugId}/${deck.slug}/add${section.isUnsectioned ? '' : `/${section.id}`}`}>
					Add cards
				</Link>
			)}
			{isExpanded && (!cards || cards.length > 0) && (
				cards
					? (
						<div className="cards">
							{cards.map(card => (
								<CardCell
									key={card.id}
									deck={deck}
									card={card}
									onClick={() => console.log('Edit card')}
								/>
							))}
						</div>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
			)}
		</div>
	)
}
