import Link from 'next/link'
import cx from 'classnames'

import Deck from 'models/Deck'
import useSelectedDeck from 'hooks/useSelectedDeck'
import { formatNumber } from 'lib/utils'

import { src as defaultImage } from 'images/logos/icon.jpg'

const DashboardSidebarRow = ({ deck }: { deck: Deck }) => {
	const [selectedDeck] = useSelectedDeck()

	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0

	return (
		<Link href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`}>
			<a className={cx({ selected: selectedDeck?.id === deck.id })}>
				<img
					src={deck.imageUrl ?? defaultImage}
					alt={deck.name}
					loading="lazy"
				/>
				<span className="title">{deck.name}</span>
				{numberOfDueCards > 0 && (
					<span className="badge">{formatNumber(numberOfDueCards)}</span>
				)}
			</a>
		</Link>
	)
}

export default DashboardSidebarRow
