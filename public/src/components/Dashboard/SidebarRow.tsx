import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../models/Deck'
import LoadingState from '../../models/LoadingState'
import useSelectedDeck from '../../hooks/useSelectedDeck'
import useImageUrl from '../../hooks/useImageUrl'
import { formatNumber } from '../../utils'

export default ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	return (
		<Link
			to={`/decks/${deck.id}`}
			className={cx({
				selected: selectedDeck?.id === deck.id
			})}
		>
			{imageUrlLoadingState === LoadingState.Loading || (
				<img src={imageUrl ?? require('../../images/logos/icon.png')} alt={deck.name} />
			)}
			<p className="title">
				{deck.name}
			</p>
			<p className="badge">
				{deck.userData && formatNumber(deck.userData.numberOfDueCards)}
			</p>
		</Link>
	)
}
