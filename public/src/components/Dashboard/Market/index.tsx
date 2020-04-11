import React, { useState, useEffect, useCallback } from 'react'
import Helmet from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroller'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useQuery from '../../../hooks/useQuery'
import useSearchState from '../../../hooks/useSearchState'
import Deck from '../../../models/Deck'
import DeckSearch, {
	DeckSortAlgorithm,
	DEFAULT_DECK_SORT_ALGORITHM,
	decodeDeckSortAlgorithm,
	nameForDeckSortAlgorithm
} from '../../../models/Deck/Search'
import Counters, { Counter } from '../../../models/Counters'
import Input from '../../shared/Input'
import SortDropdown from '../../shared/SortDropdown'
import DeckCell from '../../shared/DeckCell'
import Loader from '../../shared/Loader'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/Market.scss'

export const urlForMarket = () => {
	const [{ query, sortAlgorithm }] = useSearchState() // eslint-disable-line
	
	return urlWithQuery('/market', {
		q: query,
		s: sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
			? null
			: sortAlgorithm
	})
}

export default () => {
	const history = useHistory()
	const searchParams = useQuery()
	
	const [, setSearchState] = useSearchState()
	
	const query = searchParams.get('q') ?? ''
	const sortAlgorithm = decodeDeckSortAlgorithm(
		searchParams.get('s') ?? ''
	) ?? DEFAULT_DECK_SORT_ALGORITHM
	
	const [decks, setDecks] = useState([] as Deck[])
	const [isLastPage, setIsLastPage] = useState(false)
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)
	
	const numberOfDecks = Counters.get(Counter.Decks)
	
	useEffect(() => {
		setIsLastPage(false)
		
		let shouldContinue = true
		
		getDecks(1).then(decks =>
			shouldContinue && setDecks(decks)
		)
		
		setSearchState({ query, sortAlgorithm })
		
		return () => { shouldContinue = false }
	}, [query, sortAlgorithm]) // eslint-disable-line
	
	const onInputRef = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])
	
	const getDecks = async (pageNumber: number) => {
		try {
			const decks = await DeckSearch.search(query, {
				pageNumber,
				pageSize: 40,
				sortAlgorithm,
				filterForTopics: null
			})
			
			if (!decks.length)
				setIsLastPage(true)
			
			return decks
		} catch (error) {
			setIsLastPage(true)
			console.error(error)
			
			return []
		}
	}
	
	const loadMoreDecks = async (pageNumber: number) =>
		setDecks([...decks, ...await getDecks(pageNumber)])
	
	return (
		<Dashboard selection={Selection.Market} className="market" gradientHeight="500px">
			<Helmet>
				<title>
					{
						query && `${query} | `
					}{
						sortAlgorithm === DeckSortAlgorithm.Relevance
							? ''
							: `${nameForDeckSortAlgorithm(sortAlgorithm)} | `
					}memorize.ai
				</title>
			</Helmet>
			<div className="header">
				<Input
					ref={onInputRef}
					className="search"
					icon={faSearch}
					type="name"
					placeholder={
						`Explore ${numberOfDecks === null ? '...' : formatNumber(numberOfDecks)} decks`
					}
					value={query}
					setValue={newQuery =>
						history.push(urlWithQuery('/market', {
							q: newQuery,
							s: sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? null
								: sortAlgorithm
						}))
					}
				/>
				<SortDropdown
					isShowing={isSortDropdownShowing}
					setIsShowing={setIsSortDropdownShowing}
					algorithm={sortAlgorithm}
					setAlgorithm={newSortAlgorithm =>
						history.push(urlWithQuery('/market', {
							q: query,
							s: newSortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? null
								: newSortAlgorithm
						}))
					}
				/>
			</div>
			<div className="decks">
				<InfiniteScroll
					pageStart={1}
					loadMore={loadMoreDecks}
					hasMore={!isLastPage}
					loader={
						<Loader
							key={0}
							size="24px"
							thickness="4px"
							color="#582efe"
						/>
					}
					useWindow={false}
				>
					<div className="grid">
						{decks.map(deck => (
							<DeckCell
								key={deck.id}
								deck={deck}
								query={query}
							/>
						))}
					</div>
				</InfiniteScroll>
			</div>
		</Dashboard>
	)
}
