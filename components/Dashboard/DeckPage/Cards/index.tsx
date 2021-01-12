import { useMemo, useState } from 'react'

import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import useExpandedSections from 'hooks/useExpandedSections'
import SectionHeader from 'components/SectionHeader'
import CardCell from 'components/CardCell'
import ShareSectionModal from 'components/Modal/ShareSection'
import { formatNumber } from 'lib/utils'

import styles from './index.module.scss'

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
		<div id="cards" className={styles.root}>
			<h2 className={styles.title}>
				Cards{' '}
				<span className={styles.count}>
					({formatNumber(deck.numberOfCards)})
				</span>
			</h2>
			<div className={styles.sections}>
				{sections.map(section => {
					const isExpanded = isSectionExpanded(section.id)

					return (
						<div key={section.id} className={styles.section}>
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
								<div className={styles.cards}>
									{cards[section.id]?.map(card => (
										<CardCell
											key={card.id}
											className={styles.card}
											card={card}
										/>
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
