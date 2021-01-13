import { useMemo } from 'react'

import Deck from 'models/Deck'
import includesNormalized from 'lib/includesNormalized'
import Row from '../SidebarRow'

import styles from './index.module.scss'

export interface DashboardSidebarSectionProps {
	title: string
	decks: Deck[]
	query: string
	includesDivider?: boolean
}

const DashboardSidebarSection = ({
	title,
	decks: allDecks,
	query,
	includesDivider = false
}: DashboardSidebarSectionProps) => {
	const decks = useMemo(
		() =>
			allDecks.filter(
				deck => deck.name && includesNormalized(query, [deck.name])
			),
		[allDecks, query]
	)

	return decks.length ? (
		<div className={styles.root}>
			<p className={styles.title}>{title}</p>
			<div className={styles.decks}>
				{decks.map(deck => (
					<Row key={deck.id} deck={deck} />
				))}
			</div>
			{includesDivider && <div className={styles.divider} />}
		</div>
	) : null
}

export default DashboardSidebarSection
