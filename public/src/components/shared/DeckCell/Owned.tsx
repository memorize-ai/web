import React, { useMemo, useCallback, MouseEvent, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import Deck from '../../../models/Deck'
import Base from './Base'
import { randomEmoji } from '../../../utils'

import '../../../scss/components/DeckCell/Owned.scss'

const OwnedDeckCell = ({ deck }: { deck: Deck }) => {
	const emoji = useRef(randomEmoji())
	
	const history = useHistory()
	const { userData } = deck
	
	const numberOfDueCards = userData?.numberOfDueCards ?? 0
	const hasDueCards = Boolean(numberOfDueCards)
	
	const numberOfSections = useMemo(() => (
		Object.values(userData?.sections ?? {}).reduce((acc, count) => (
			acc + (count ? 1 : 0)
		), 0)
	), [userData])
	
	const review = useCallback((event: MouseEvent) => {
		event.preventDefault()
		history.push(deck.reviewUrl())
	}, [history, deck])
	
	return (
		<Base
			className="owned"
			deck={deck}
			href={`/decks/${deck.slugId}/${deck.slug}`}
			nameProps={{
				style: { WebkitLineClamp: deck.subtitle ? 2 : 3 }
			}}
		>
			<p className="due-cards-message">
				{hasDueCards
					? `${
						numberOfDueCards
					} card${
						numberOfDueCards === 1 ? '' : 's'
					} due in ${
						numberOfSections
					} section${
						numberOfSections === 1 ? '' : 's'
					}`
					: `${emoji.current} Woohoo! No cards due`
				}
			</p>
			{hasDueCards && (
				<button className="review-button" onClick={review}>
					Review
				</button>
			)}
		</Base>
	)
}

export default OwnedDeckCell
