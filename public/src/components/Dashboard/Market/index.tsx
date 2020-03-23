import React, { useState, useEffect } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import Deck from '../../../models/Deck'
import DeckSearch, { DeckSortAlgorithm } from '../../../models/Deck/Search'
import Input from '../../shared/Input'
import DeckCell from './DeckCell'

import '../../../scss/components/Dashboard/Market.scss'

export default () => {
	const [query, setQuery] = useState('')
	const [decks, setDecks] = useState([] as Deck[])
	
	useEffect(() => void (async () => {
		setDecks(await DeckSearch.search(query, {
			sortAlgorithm: DeckSortAlgorithm.Relevance,
			filterForTopics: null
		}))
	})(), [query])
	
	return (
		<Dashboard selection={Selection.Market} className="market">
			<Input
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
		</Dashboard>
	)
}
