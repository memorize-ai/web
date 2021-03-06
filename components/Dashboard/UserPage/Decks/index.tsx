import { useCallback } from 'react'

import User from 'models/User'
import Deck from 'models/Deck'
import formatNumber from 'lib/formatNumber'
import DeckCell from 'components/DeckCell'

import styles from './index.module.scss'

type Filter = (i: number) => boolean

const evenFilter: Filter = i => !(i & 1)
const oddFilter: Filter = i => !!(i & 1)

export interface DecksProps {
	user: User
	decks: Deck[]
}

const Decks = ({ user, decks }: DecksProps) => {
	const withFilter = useCallback(
		(filter: Filter) =>
			decks
				.filter((_, i) => filter(i))
				.map(deck => (
					<DeckCell key={deck.id} className={styles.deck} deck={deck} />
				)),
		[decks]
	)

	return (
		<div id="decks" className={styles.root}>
			<h2 className={styles.title}>
				Decks by {user.name ?? 'Anonymous'}{' '}
				<span className={styles.count}>
					({formatNumber(user.numberOfCreatedDecks ?? 0)})
				</span>
			</h2>
			<div className={styles.rows}>
				<div className={styles.row}>{withFilter(evenFilter)}</div>
				<div className={styles.row}>{withFilter(oddFilter)}</div>
			</div>
		</div>
	)
}

export default Decks
