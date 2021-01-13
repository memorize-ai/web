import Link from 'next/link'
import cx from 'classnames'

import Deck from 'models/Deck'
import useSelectedDeck from 'hooks/useSelectedDeck'
import { formatNumber } from 'lib/utils'

import { src as defaultImage } from 'images/logos/icon.jpg'
import styles from './index.module.scss'

export interface DashboardSidebarRowProps {
	deck: Deck
}

const DashboardSidebarRow = ({ deck }: DashboardSidebarRowProps) => {
	const [selectedDeck] = useSelectedDeck()

	const numberOfDueCards = deck.userData?.numberOfDueCards ?? 0

	return (
		<Link href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`}>
			<a
				className={cx(styles.root, {
					[styles.selected]: selectedDeck?.id === deck.id
				})}
			>
				<img
					className={styles.image}
					src={deck.imageUrl ?? defaultImage}
					alt={deck.name}
					loading="lazy"
				/>
				<span className={styles.title}>{deck.name}</span>
				{numberOfDueCards > 0 && (
					<span className={styles.badge}>{formatNumber(numberOfDueCards)}</span>
				)}
			</a>
		</Link>
	)
}

export default DashboardSidebarRow
