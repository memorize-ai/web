import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../models/Deck'
import LoadingState from '../../models/LoadingState'
import useSelectedDeck from '../../hooks/useSelectedDeck'
import useImageUrl from '../../hooks/useImageUrl'
import { formatNumber } from '../../utils'

const DashboardSidebarRow = ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0
	
	return (
		<Link
			to={`/decks/${deck.slugId}/${deck.slug}`}
			className={cx({
				selected: selectedDeck?.id === deck.id
			})}
		>
			{imageUrlLoadingState === LoadingState.Loading || (
				<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
			)}
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
