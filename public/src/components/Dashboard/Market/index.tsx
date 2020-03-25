import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroller'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import useQuery from '../../../hooks/useQuery'
import Deck from '../../../models/Deck'
import DeckSearch, { DeckSortAlgorithm, decodeDeckSortAlgorithm } from '../../../models/Deck/Search'
import { urlWithQuery } from '../../../utils'
import Input from '../../shared/Input'
import Loader from '../../shared/Loader'
import DeckCell from './DeckCell'
import Sort from './Sort'

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
	
	useEffect(() => void (async () => {
		setIsLastPage(false)
		setDecks(await getDecks(1))
		
		history.push(urlWithQuery('/market', {
			q: query,
			s: sortAlgorithm === DeckSortAlgorithm.Recommended
				? null
				: sortAlgorithm
		}))
	})(), [query, sortAlgorithm]) // eslint-disable-line
	
	useEffect(() => {
		if (query || sortAlgorithm === DeckSortAlgorithm.Recommended)
			return
		
		setSortAlgorithm(DeckSortAlgorithm.Recommended)
	}, [query]) // eslint-disable-line
	
	const getDecks = async (pageNumber: number) => {
		try {
			const decks = await DeckSearch.search(query, {
				pageNumber,
				pageSize: 20,
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
		<Dashboard selection={Selection.Market} className="market">
			<Input
				className="search"
				icon={faSearch}
				type="name"
				placeholder="Decks"
				value={query}
				setValue={setQuery}
			/>
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
							color="#63b3ed"
						/>
					}
					useWindow={false}
				>
					{decks.map(deck => (
						<DeckCell key={deck.id} deck={deck} />
					))}
				</InfiniteScroll>
			</div>
			<Sort algorithm={sortAlgorithm} setAlgorithm={setSortAlgorithm} />
		</Dashboard>
	)
}
