import React from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from 'react-bulma-components'

import useDeck from '../hooks/useDeck'
import useSection from '../hooks/useSection'

import '../scss/UnlockSection.scss'

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	
	return (
		<div id="unlock-section">
			<Heading textColor="white">{deck?.name}</Heading>
		</div>
	)
}
