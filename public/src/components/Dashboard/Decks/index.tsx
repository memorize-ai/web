import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useQuery from '../../../hooks/useQuery'
import useSelectedDeck from '../../../hooks/useSelectedDeck'
import useDecks from '../../../hooks/useDecks'
import Content from './Content'
import Modal from '../../shared/Modal'

import '../../../scss/components/Dashboard/Decks.scss'

export default () => {
	requiresAuth()
	
	const { slug } = useParams()
	const history = useHistory()
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const decks = useDecks()
	
	const isNew = useQuery().get('new') === '1'
	const [isIntroModalShowing, setIsIntroModalShowing] = useState(isNew)
	
	useEffect(() => {
		if (!slug && selectedDeck)
			history.push(`/decks/${selectedDeck.slug}`)
	}, [slug, selectedDeck]) // eslint-disable-line
	
	useEffect(() => {
		if (selectedDeck && selectedDeck.slug === slug)
			return
		
		const deck = decks.find(deck => deck.slug === slug)
		
		deck && setSelectedDeck(deck)
	}, [selectedDeck, slug, decks]) // eslint-disable-line
	
	useEffect(() => {
		if (isNew && !isIntroModalShowing)
			history.replace(window.location.pathname)
	}, [isNew, isIntroModalShowing, history])
	
	return (
		<Dashboard selection={Selection.Decks} className="decks" gradientHeight="350px">
			{selectedDeck
				? <Content deck={selectedDeck} />
				: 'Loading...'
			}
			<Modal
				className="deck-intro"
				isShowing={isIntroModalShowing}
				setIsShowing={setIsIntroModalShowing}
			>
				Intro
			</Modal>
		</Dashboard>
	)
}
