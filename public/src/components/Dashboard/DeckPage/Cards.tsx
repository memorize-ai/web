import React from 'react'
import _ from 'lodash'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useSections from '../../../hooks/useSections'
import useExpandedSections from '../../../hooks/useExpandedSections'
import useAllCards from '../../../hooks/useAllCards'
import SectionHeader from '../../shared/SectionHeader'
import CardCell from '../../shared/CardCell'
import Loader from '../../shared/Loader'
import { formatNumber } from '../../../utils'

export default ({ deck }: { deck: Deck }) => {
	const sections = useSections(deck.id)
	const [
		isSectionExpanded,
		toggleSectionExpanded
	] = useExpandedSections(deck, { isOwned: false, defaultExpanded: true })
	
	const _cards = useAllCards(deck.id)
	const cards = _cards && _.flatten(Object.values(_cards))
	
	const cardsForSection = (section: Section) =>
		cards
			? cards
				.filter(card => card.sectionId === section.id)
				.map(card => (
					<CardCell key={card.id} card={card} />
				))
			: <Loader size="24px" thickness="4px" color="#582efe" />
	
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
							/>
							{isExpanded && (
								<div className="cards">
									{cardsForSection(section)}
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
