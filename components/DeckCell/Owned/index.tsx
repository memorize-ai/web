import { useMemo, useCallback, MouseEvent } from 'react'
import Router from 'next/router'

import Deck from 'models/Deck'
import Base from '../Base'
import randomEmoji from 'lib/randomEmoji'

import styles from './index.module.scss'

export interface OwnedDeckCellProps {
	className?: string
	deck: Deck
}

const OwnedDeckCell = ({ className, deck }: OwnedDeckCellProps) => {
	const emoji = useMemo(randomEmoji, [])

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
			className={className}
			contentClassName={styles.content}
			deck={deck}
			href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`}
			nameProps={{
				style: { WebkitLineClamp: deck.subtitle ? 2 : 3 }
			}}
		>
			<span className={styles.due}>
				{hasDueCards ? (
					`${numberOfDueCards} card${
						numberOfDueCards === 1 ? '' : 's'
					} due in ${numberOfSections} section${
						numberOfSections === 1 ? '' : 's'
					}`
				) : (
					<>
						<span className={styles.dueEmoji} aria-hidden role="img">
							{emoji}
						</span>{' '}
						Woohoo! No cards due
					</>
				)}
			</span>
			{hasDueCards && (
				<span className={styles.review} role="button" onClick={review}>
					Review
				</span>
			)}
		</Base>
	)
}

export default OwnedDeckCell
