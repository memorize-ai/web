import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../models/Deck'
import useSelectedDeck from '../../hooks/useSelectedDeck'
import { formatNumber } from '../../utils'

const DashboardSidebarRow = ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()
	
	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0
	
	return (
		<Link
			to={`/decks/${deck.slugId}/${deck.slug}`}
			className={cx({
				selected: selectedDeck?.id === deck.id
			})}
		>
			<img src={deck.imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
			<p className="title">
				{deck.name}
			</p>
			{numberOfDueCards > 0 && (
				<p className="badge">
					{formatNumber(numberOfDueCards)}
				</p>
			)}
		</Link>
	)
}

export default memo(DashboardSidebarRow)
