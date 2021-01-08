import { useMemo, useState } from 'react'

import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import useExpandedSections from 'hooks/useExpandedSections'
import SectionHeader from 'components/SectionHeader'
import CardCell from 'components/CardCell'
import ShareSectionModal from 'components/Modal/ShareSection'
import { formatNumber } from 'lib/utils'

export interface DeckPageCardsProps {
	deck: Deck
	sections: Section[]
	cards: Record<string, Card[] | undefined>
}

const DeckPageCards = ({
	deck,
	sections: namedSections,
	cards
}: DeckPageCardsProps) => {
	const sections = useMemo(
		() =>
			deck.numberOfUnsectionedCards > 0
				? [deck.unsectionedSection, ...namedSections]
				: namedSections,
		[deck, namedSections]
	)

	const [isSectionExpanded, toggleSectionExpanded] = useExpandedSections(deck, {
		isOwned: false,
		defaultExpanded: true
	})

	const [selectedSection, setSelectedSection] = useState(null as Section | null)
	const [isShareSectionModalShowing, setIsShareSectionModalShowing] = useState(
		false
	)

	if (!sections.length) return null

	return (
		<div id="cards" className="cards">
			<h2 className="title">
				Cards <span>({formatNumber(deck.numberOfCards)})</span>
			</h2>
			<div className="sections">
				{sections.map(section => {
					const isExpanded = isSectionExpanded(section.id)

					return (
						<div key={section.id}>
							<SectionHeader
								section={section}
								isExpanded={isExpanded}
								toggleExpanded={() => toggleSectionExpanded(section.id)}
								onShare={() => {
									setSelectedSection(section)
									setIsShareSectionModalShowing(true)
								}}
							/>
							{isExpanded && (
								<div className="cards">
									{cards[section.id]?.map(card => (
										<CardCell key={card.id} card={card} />
									))}
								</div>
							)}
						</div>
					)
				})}
			</div>
			<ShareSectionModal
				deck={deck}
				section={selectedSection}
				isShowing={isShareSectionModalShowing}
				setIsShowing={setIsShareSectionModalShowing}
			/>
		</div>
	)
}

export default DeckPageCards
