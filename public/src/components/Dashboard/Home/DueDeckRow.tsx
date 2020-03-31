import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useImageUrl from '../../../hooks/useImageUrl'
import { formatNumber } from '../../../utils'

export default ({ deck }: { deck: Deck }) => {
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	return (
		<Link to={`/decks/${deck.id}`}>
			{imageUrlLoadingState === LoadingState.Loading || (
				<img src={imageUrl ?? Deck.defaultImage} alt={deck.name} />
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
