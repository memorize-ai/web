import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import useQuery from '../../../hooks/useQuery'
import Deck from '../../../models/Deck'
import DeckSearch, { DeckSortAlgorithm, decodeDeckSortAlgorithm } from '../../../models/Deck/Search'
import { urlWithQuery } from '../../../utils'
import Input from '../../shared/Input'
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
	
	useEffect(() => void (async () => {
		setDecks(await DeckSearch.search(query, {
			sortAlgorithm,
			filterForTopics: null
		}))
	})(), [query, sortAlgorithm])
	
	useEffect(() => {
		if (query || sortAlgorithm === DeckSortAlgorithm.Recommended)
			return
		
		setSortAlgorithm(DeckSortAlgorithm.Recommended)
	}, [query]) // eslint-disable-line
	
	useEffect(() => {
		history.push(urlWithQuery('/market', {
			q: query,
			s: sortAlgorithm === DeckSortAlgorithm.Recommended
				? null
				: sortAlgorithm
		}))
	}, [query, sortAlgorithm]) // eslint-disable-line
	
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
				{decks.map(deck => (
					<DeckCell key={deck.id} deck={deck} />
				))}
			</div>
			<Sort algorithm={sortAlgorithm} setAlgorithm={setSortAlgorithm} />
		</Dashboard>
	)
}
