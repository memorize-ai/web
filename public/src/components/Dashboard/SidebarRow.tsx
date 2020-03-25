import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../models/Deck'
import useSelectedDeck from '../../hooks/useSelectedDeck'
import useImageUrl from '../../hooks/useImageUrl'

export default ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()
	const [imageUrl] = useImageUrl(deck)
	
	return (
		<Link
			to={`/decks/${deck.id}`}
			className={cx({
				selected: selectedDeck?.id === deck.id
			})}
		>
			{imageUrl && <img src={imageUrl} alt={deck.name} />}
			<p className="title">
				{deck.name}
			</p>
			<p className="badge">
				{deck.userData?.numberOfDueCards}
			</p>
		</Link>
	)
}
