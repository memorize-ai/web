import React, { memo, useMemo } from 'react'

import Deck from '../../models/Deck'
import { includesNormalized } from '../../utils'
import Row from './SidebarRow'

const DashboardSidebarSection = (
	{ title, decks: _decks, query, includesDivider = false }: {
		title: string
		decks: Deck[]
		query: string
		includesDivider?: boolean
	}
) => {
	const decks = useMemo(() => (
		_decks.filter(deck =>
			deck.name && includesNormalized(query, [deck.name])
		)
	), [_decks, query])
	
	return decks.length
		? (
			<div>
				<p>{title}</p>
				<div className="decks">
					{decks.map(deck => (
						<Row key={deck.id} deck={deck} />
					))}
				</div>
				{includesDivider && <div className="divider" />}
			</div>
		)
		: null
}

export default DashboardSidebarSection
