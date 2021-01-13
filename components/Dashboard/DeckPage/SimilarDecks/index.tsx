import { useCallback } from 'react'

import Deck from 'models/Deck'
import DeckCell from 'components/DeckCell'
import { formatNumber } from 'lib/utils'

import styles from './index.module.scss'

const evenFilter = (i: number) => !(i & 1)
const oddFilter = (i: number) => !!(i & 1)

export interface DeckPageSimilarDecksProps {
	similarDecks: Deck[] | null
}

const DeckPageSimilarDecks = ({ similarDecks }: DeckPageSimilarDecksProps) => {
	const withFilter = useCallback(
		(filter: (i: number) => boolean) => {
			if (!similarDecks) return null

			return similarDecks
				.filter((_, i) => filter(i))
				.map(deck => (
					<DeckCell key={deck.id} className={styles.deck} deck={deck} />
				))
		},
		[similarDecks]
	)

	if (!similarDecks) return null

	return (
		<div id="similar" className={styles.root}>
			<h2 className={styles.title}>
				We think you'd like...{' '}
				<span className={styles.count}>
					({formatNumber(similarDecks.length)})
				</span>
			</h2>
			<div className={styles.rows}>
				<div className={styles.row}>{withFilter(evenFilter)}</div>
				<div className={styles.row}>{withFilter(oddFilter)}</div>
			</div>
		</div>
	)
}

export default DeckPageSimilarDecks
