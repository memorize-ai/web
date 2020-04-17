import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Header from './Header'
import IntroModal from './IntroModal'

import '../../../scss/components/Dashboard/Decks.scss'

export default () => {
	requiresAuth()
	
	const { slug } = useParams()
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const decks = useDecks()
	
	useEffect(() => {
		if (!slug && selectedDeck)
			history.replace(`/decks/${selectedDeck.slug}`)
	}, [slug, selectedDeck]) // eslint-disable-line
	
	useEffect(() => {
		if (selectedDeck && selectedDeck.slug === slug)
			return
		
		const deck = decks.find(deck => deck.slug === slug)
		
		deck && setSelectedDeck(deck)
	}, [selectedDeck, slug, decks]) // eslint-disable-line
	
	return (
		<Dashboard selection={Selection.Decks} className="decks" gradientHeight="500px">
			<Header deck={selectedDeck} />
			<IntroModal />
		</Dashboard>
	)
}
