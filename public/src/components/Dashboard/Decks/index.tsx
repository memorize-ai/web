import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard, { DashboardTabSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'

export default () => {
	requiresAuth('/decks')
	
	const { deckId } = useParams()
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const decks = useDecks()
	
	useEffect(() => {
		if (!deckId && selectedDeck)
			history.push(`/decks/${selectedDeck.id}`)
	}, [deckId, selectedDeck]) // eslint-disable-line
	
	useEffect(() => {
		if (selectedDeck && selectedDeck.id === deckId)
			return
		
		const deck = decks.find(deck => deck.id === deckId)
		
		deck && setSelectedDeck(deck)
	}, [selectedDeck, deckId, decks]) // eslint-disable-line
	
	return (
		<Dashboard selection={Selection.Decks} className="decks">
			{selectedDeck
				? <>{selectedDeck.name}</>
				: <>Loading...</>
			}
		</Dashboard>
	)
}
