import React from 'react'

import { DeckSortAlgorithm } from '../../../models/Deck/Search'
import Row from './SortRow'

export const algorithms = [
	{ title: 'Recommended', type: DeckSortAlgorithm.Recommended },
	{ title: 'Relevance', type: DeckSortAlgorithm.Relevance },
	{ title: 'Top', type: DeckSortAlgorithm.Top },
	{ title: 'Rating', type: DeckSortAlgorithm.Rating },
	{ title: 'Popularity', type: DeckSortAlgorithm.CurrentUsers },
	{ title: 'New', type: DeckSortAlgorithm.New },
	{ title: 'Recently updated', type: DeckSortAlgorithm.RecentlyUpdated }
]

export default (
	{ algorithm, setAlgorithm }: {
		algorithm: DeckSortAlgorithm
		setAlgorithm: (algorithm: DeckSortAlgorithm) => void
	}
) => (
	<div className="sort">
		<h1>Sort by...</h1>
		<div className="rows">
			{algorithms.map(({ title, type }) => (
				<Row
					key={type}
					title={title}
					isSelected={algorithm === type}
					onSelect={() => setAlgorithm(type)}
				/>
			))}
		</div>
	</div>
)
