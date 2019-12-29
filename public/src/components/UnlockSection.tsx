import React from 'react'
import { useParams } from 'react-router-dom'

import useDeck from '../hooks/useDeck'
import useSection from '../hooks/useSection'

import '../scss/UnlockSection.scss'

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	
	return (
		<div id="unlock-section">
			Deck: {deck?.name ?? 'Loading...'}<br />
			Section: {section?.name ?? 'Loading...'}
		</div>
	)
}
