import React from 'react'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useExpandedSections from '../../../hooks/useExpandedSections'
import useCards from '../../../hooks/useCards'
import CardCell from '../../shared/CardCell'
import Loader from '../../shared/Loader'

export default ({ deck, section }: { deck: Deck, section: Section }) => {
	const [isSectionExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})
	
	const isExpanded = isSectionExpanded(section.id)
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div className={cx('cards', { expanded: isExpanded })}>
			{isExpanded
				? cards
					? cards.map(card => (
						<CardCell key={card.id} card={card} />
					))
					: <Loader size="24px" thickness="4px" color="#582efe" />
				: null
			}
		</div>
	)
}
