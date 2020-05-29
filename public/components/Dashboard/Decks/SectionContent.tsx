import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Deck from 'models/Deck'
import Section from 'models/Section'
import useCurrentUser from 'hooks/useCurrentUser'
import SectionHeader from 'components/shared/SectionHeader/Owned'
import useCards from 'hooks/useCards'
import CardCell from 'components/shared/CardCell/Owned'
import Loader from 'components/shared/Loader'

export type SetSelectedSectionAction = 'unlock' | 'rename' | 'delete' | 'share'

export default (
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
	
	return (
		<div className="section">
			<SectionHeader
				deck={deck}
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
				onUnlock={() => setSelectedSection('unlock')}
				onRename={() => setSelectedSection('rename')}
				onDelete={() => setSelectedSection('delete')}
				onShare={() => setSelectedSection('share')}
				numberOfSections={numberOfSections}
				reorder={reorder}
			/>
			{currentUser?.id === deck.creatorId && (
				<div className="add-cards-container">
					<Link
						href={
							`/decks/[slugId]/[slug]/add${
								section.isUnsectioned ? '' : '/[sectionId]'
							}`
						}
						as={
							`/decks/${
								deck.slugId
							}/${
								deck.slug
							}/add${
								section.isUnsectioned ? '' : `/${section.id}`
							}`
						}
					>
						<a>
							<FontAwesomeIcon icon={faPlus} />
							<p>Add cards to <i>{section.name}</i></p>
						</a>
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
