import { useMemo, useCallback, MouseEvent, useRef } from 'react'
import Router from 'next/router'

import Deck from 'models/Deck'
import Base from './Base'
import { randomEmoji } from 'lib/utils'

const OwnedDeckCell = ({ deck }: { deck: Deck }) => {
	const emoji = useRef(randomEmoji())

	const { userData } = deck
	const numberOfDueCards = userData?.numberOfDueCards ?? 0
	const hasDueCards = Boolean(numberOfDueCards)

	const numberOfSections = useMemo(
		() =>
			(userData?.numberOfUnsectionedDueCards ? 1 : 0) +
			Object.values(userData?.sections ?? {}).reduce(
				(acc, count) => acc + (count ? 1 : 0),
				0
			),
		[userData]
	)

	const review = useCallback(
		(event: MouseEvent) => {
			event.preventDefault()
			Router.push(deck.reviewUrl())
		},
		[deck]
	)

	return (
		<Base
			className="owned"
			deck={deck}
			href={`/decks/${deck.slugId}/${deck.slug}`}
			nameProps={{
				style: { WebkitLineClamp: deck.subtitle ? 2 : 3 }
			}}
		>
			<span className="due-cards-message">
				{hasDueCards ? (
					`${numberOfDueCards} card${
						numberOfDueCards === 1 ? '' : 's'
					} due in ${numberOfSections} section${
						numberOfSections === 1 ? '' : 's'
					}`
				) : (
					<>
						<span aria-hidden="true" role="img">
							{emoji.current}
						</span>{' '}
						Woohoo! No cards due
					</>
				)}
			</span>
			{hasDueCards && (
				<span role="button" className="review-button" onClick={review}>
					Review
				</span>
			)}
		</Base>
	)
}

export default OwnedDeckCell
