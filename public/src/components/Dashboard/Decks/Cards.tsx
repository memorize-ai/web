import React from 'react'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useExpandedSections from '../../../hooks/useExpandedSections'
import useCards from '../../../hooks/useCards'
import Loader from '../../shared/Loader'

export default ({ deck, section }: { deck: Deck, section: Section }) => {
	const isExpanded = useExpandedSections(deck)[0](section.id)
	const cards = useCards(deck, section, isExpanded)
	
	return (
		<div className={cx('cards', { expanded: isExpanded })}>
			{cards
				? cards.map(card => (
					<div key={card.id}>
						<p>{card.front}</p>
						<p>{card.back}</p>
					</div>
				))
				: <Loader size="24px" thickness="4px" color="#63b3ed" />
			}
		</div>
	)
}
