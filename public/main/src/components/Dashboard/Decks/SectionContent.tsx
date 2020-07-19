import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useCurrentUser from '../../../hooks/useCurrentUser'
import SectionHeader from '../../shared/SectionHeader/Owned'
import useCards from '../../../hooks/useCards'
import CardCell from '../../shared/CardCell/Owned'
import Loader from '../../shared/Loader'

export type SetSelectedSectionAction = 'unlock' | 'rename' | 'delete' | 'share'

const DecksSectionContent = (
	{ deck, section, isExpanded, toggleExpanded, setSelectedSection, numberOfSections, reorder }: {
		deck: Deck
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
		setSelectedSection: (action: SetSelectedSectionAction) => void
		numberOfSections: number
		reorder: (delta: number) => void
	}
) => {
	const [currentUser] = useCurrentUser()
	const cards = useCards(deck, section, isExpanded)
	
	const onUnlock = useCallback(() => (
		setSelectedSection('unlock')
	), [setSelectedSection])
	
	const onRename = useCallback(() => (
		setSelectedSection('rename')
	), [setSelectedSection])
	
	const onDelete = useCallback(() => (
		setSelectedSection('delete')
	), [setSelectedSection])
	
	const onShare = useCallback(() => (
		setSelectedSection('share')
	), [setSelectedSection])
	
	return (
		<div className="section">
			<SectionHeader
				deck={deck}
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
				onUnlock={onUnlock}
				onRename={onRename}
				onDelete={onDelete}
				onShare={onShare}
				numberOfSections={numberOfSections}
				reorder={reorder}
			/>
			{currentUser?.id === deck.creatorId && (
				<div className="add-cards-container">
					<Link to={
						`/decks/${
							deck.slugId
						}/${
							deck.slug
						}/add${
							section.isUnsectioned ? '' : `/${section.id}`
						}`
					}>
						<FontAwesomeIcon icon={faPlus} />
						<p>Add cards to <i>{section.name}</i></p>
					</Link>
				</div>
			)}
			{isExpanded && (!cards || cards.length > 0) && (
				cards
					? (
						<div className="cards">
							{cards.map(card => (
								<CardCell key={card.id} deck={deck} card={card} />
							))}
						</div>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
			)}
		</div>
	)
}

export default DecksSectionContent
