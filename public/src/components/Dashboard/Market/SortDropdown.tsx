import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { DeckSortAlgorithm } from '../../../models/Deck/Search'
import Dropdown from '../../shared/Dropdown'

import { ReactComponent as SortIcon } from '../../../images/icons/sort.svg'

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
	{ isShowing, setIsShowing, algorithm, setAlgorithm }: {
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
		algorithm: DeckSortAlgorithm
		setAlgorithm: (algorithm: DeckSortAlgorithm) => void
	}
) => (
	<Dropdown
		className="sort-dropdown"
		trigger={
			<>
				<SortIcon />
				<p>Sort</p>
			</>
		}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		{algorithms.map(({ title, type }) => {
			const selected = algorithm === type
			
			return (
				<button
					key={type}
					className={cx({ selected })}
					onClick={() => setAlgorithm(type)}
				>
					{selected && <FontAwesomeIcon icon={faCheck} />}
					<p>{title}</p>
				</button>
			)
		})}
	</Dropdown>
)
