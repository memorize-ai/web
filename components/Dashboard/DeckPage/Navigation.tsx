import { useState, useCallback } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

import { DeckSortAlgorithm, DEFAULT_DECK_SORT_ALGORITHM } from 'models/Deck/Search'
import { flattenQuery, formatNumber } from 'lib/utils'
import useSearchState from 'hooks/useSearchState'
import Input from 'components/Input'
import SortDropdown from 'components/SortDropdown'
import { DropdownShadow } from 'components/Dropdown'

export interface DeckPageNavigationProps {
	numberOfDecks: number
}

const DeckPageNavigation = ({ numberOfDecks }: DeckPageNavigationProps) => {
	const [{ query, sortAlgorithm }] = useSearchState()
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)
	
	const setQuery = useCallback((newQuery: string) => {
		Router.push({
			pathname: '/market',
			query: flattenQuery({
				q: newQuery,
				s: sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
					? null
					: sortAlgorithm
			})
		})
	}, [sortAlgorithm])
	
	const setSortAlgorithm = useCallback((newAlgorithm: DeckSortAlgorithm) => {
		Router.push({
			pathname: '/market',
			query: flattenQuery({
				q: query,
				s: newAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
					? null
					: newAlgorithm
			})
		})
	}, [query])
	
	return (
		<div className="header">
			<Link href="/new">
				<a
					className="create"
					aria-label="Create your own deck!"
					data-balloon-pos="right"
				>
					<FontAwesomeIcon icon={faPlus} />
				</a>
			</Link>
			<Input
				className="search"
				icon={faSearch}
				type="name"
				placeholder={`Explore ${formatNumber(numberOfDecks)} decks`}
				value={query}
				setValue={setQuery}
			/>
			<SortDropdown
				shadow={DropdownShadow.Around}
				isShowing={isSortDropdownShowing}
				setIsShowing={setIsSortDropdownShowing}
				algorithm={sortAlgorithm}
				setAlgorithm={setSortAlgorithm}
			/>
		</div>
	)
}

export default DeckPageNavigation
