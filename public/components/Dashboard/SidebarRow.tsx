import React from 'react'
import Link from 'next/link'
import cx from 'classnames'

import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useSelectedDeck from 'hooks/useSelectedDeck'
import useImageUrl from 'hooks/useImageUrl'
import { formatNumber } from 'lib/utils'

export default ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0
	
	return (
		<Link
			href="/decks/[slugId]/[slug]"
			as={`/decks/${deck.slugId}/${deck.slug}`}
		>
			<a className={cx({ selected: selectedDeck?.id === deck.id })}>
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
			</a>
		</Link>
	)
}
