import { useState, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import Router from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

import {
	DeckSortAlgorithm,
	DEFAULT_DECK_SORT_ALGORITHM
} from 'models/Deck/Search'
import searchState from 'state/search'
import { flattenQuery, formatNumber } from 'lib/utils'
import Input from 'components/Input'
import SortDropdown from 'components/SortDropdown'
import { DropdownShadow } from 'components/Dropdown'

import styles from './index.module.scss'

export interface DeckPageNavigationProps {
	numberOfDecks: number
}

const DeckPageNavigation = ({ numberOfDecks }: DeckPageNavigationProps) => {
	const { query, sortAlgorithm } = useRecoilValue(searchState)
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)

	const setQuery = useCallback(
		(newQuery: string) => {
			Router.push({
				pathname: '/market',
				query: flattenQuery({
					q: newQuery,
					s:
						sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM ? null : sortAlgorithm
				})
			})
		},
		[sortAlgorithm]
	)

	const setSortAlgorithm = useCallback(
		(newAlgorithm: DeckSortAlgorithm) => {
			Router.push({
				pathname: '/market',
				query: flattenQuery({
					q: query,
					s: newAlgorithm === DEFAULT_DECK_SORT_ALGORITHM ? null : newAlgorithm
				})
			})
		},
		[query]
	)

	return (
		<div className={styles.root}>
			<Link href="/new">
				<a
					className={styles.new}
					aria-label="Create your own deck!"
					data-balloon-pos="right"
				>
					<FontAwesomeIcon className={styles.newIcon} icon={faPlus} />
				</a>
			</Link>
			<Input
				className={styles.search}
				inputClassName={styles.searchInput}
				iconClassName={styles.searchIcon}
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
