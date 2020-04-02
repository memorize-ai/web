import React from 'react'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useExpandedSections from '../../../hooks/useExpandedSections'
import useCards from '../../../hooks/useCards'
import CardBox from '../../shared/CardBox'
import Loader from '../../shared/Loader'

export default ({ deck, section }: { deck: Deck, section: Section }) => {
	const isExpanded = useExpandedSections(deck)[0](section.id)
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div className={cx('cards', { expanded: isExpanded })}>
			{isExpanded
				? cards
					? cards.map(card => (
						<CardBox key={card.id} card={card} />
					))
					: <Loader size="24px" thickness="4px" color="#582efe" />
				: null
			}
		</div>
	)
}
