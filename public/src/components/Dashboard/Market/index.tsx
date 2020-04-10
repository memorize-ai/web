import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroller'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useQuery from '../../../hooks/useQuery'
import Deck from '../../../models/Deck'
import DeckSearch, { DeckSortAlgorithm, decodeDeckSortAlgorithm } from '../../../models/Deck/Search'
import Counters, { Counter } from '../../../models/Counters'
import Input from '../../shared/Input'
import SortDropdown from './SortDropdown'
import DeckCell from '../../shared/DeckCell'
import Loader from '../../shared/Loader'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/Market.scss'

export default () => {
	const history = useHistory()
	const searchParams = useQuery()
	
	const [query, setQuery] = useState(searchParams.get('q') ?? '')
	const [sortAlgorithm, setSortAlgorithm] = useState(
		decodeDeckSortAlgorithm(searchParams.get('s') ?? '') ?? DeckSortAlgorithm.Recommended
	)
	
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
		
		history.push(urlWithQuery('/market', {
			q: query,
			s: sortAlgorithm === DeckSortAlgorithm.Recommended
				? null
				: sortAlgorithm
		}))
		
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
					setValue={setQuery}
				/>
				<SortDropdown
					isShowing={isSortDropdownShowing}
					setIsShowing={setIsSortDropdownShowing}
					algorithm={sortAlgorithm}
					setAlgorithm={setSortAlgorithm}
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
