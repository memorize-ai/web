import React, { memo, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import LoadingState from '../../../models/LoadingState'
import useDecks from '../../../hooks/useDecks'
import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'

import '../../../scss/components/Dashboard/Cram.scss'
import Section from '../../../models/Section'

const CramContent = () => {
	const history = useHistory()
	const { slugId, slug, sectionId } = useParams()
	
	const [decks, decksLoadingState] = useDecks()
	
	const deck = useMemo(() => {
		if (decksLoadingState !== LoadingState.Success)
			return null
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (deck)
			return deck
		
		history.push(`/d/${slugId}/${slug}`)
		return null
	}, [decks, decksLoadingState, slugId, slug, history])
	
	const backUrl = `/decks/${slugId}/${slug}`
	
	return (
		<>
			<Navbar
				backUrl={backUrl}
				currentCardIndex={0}
				totalCards={0}
			/>
			<Sliders
				mastered={0}
				seen={0}
				unseen={0}
				total={0}
			/>
			<CardContainer
				deck={deck}
				section={new Section('a', { name: 'Section 1', index: 0, numberOfCards: 10 })}
				card={null}
			/>
			<Footer />
		</>
	)
}

export default memo(CramContent)
