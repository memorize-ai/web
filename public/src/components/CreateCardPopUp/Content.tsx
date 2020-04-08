import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import useQuery from '../../hooks/useQuery'
import useDecks from '../../hooks/useDecks'
import useSections from '../../hooks/useSections'
import firebase from '../../firebase'
import User from '../../models/User'
import Decks from './Decks'
import Sections from './Sections'
import Editors from './Editors'

import 'firebase/analytics'

const analytics = firebase.analytics()

export const getPopUpUrl = (
	{ deck, section, text, from }: {
		deck: Deck
		section?: Section
		text: string
		from: string
	}
) =>
	`/create-card-pop-up/d/${
		deck.id
	}${
		section
			? `/s/${section.id}`
			: ''
	}?text=${
		encodeURIComponent(text)
	}&from=${
		encodeURIComponent(from)
	}`

export default (
	{ currentUser, deckId, sectionId }: {
		currentUser: User
		deckId: string | undefined
		sectionId: string | undefined
	}
) => {
	const history = useHistory()
	
	const query = useQuery()
	const text = query.get('text') ?? ''
	const from = query.get('from') ?? ''
	
	const decks = useDecks().filter(deck =>
		deck.creatorId === currentUser.id
	)
	
	const currentDeck = decks.find(deck => deck.id === deckId)
	const sections = useSections(currentDeck?.id)
	
	const currentSection = sectionId
		? sections?.find(section => section.id === sectionId)
		: currentDeck?.unsectionedSection
	
	useEffect(() => {
		analytics.logEvent('show_create_card_pop_up', { from })
	}, [from])
	
	useEffect(() => {
		if (!decks.length || currentDeck || deckId)
			return
		
		history.push(getPopUpUrl({
			deck: decks[0],
			text,
			from
		}))
	}, [decks, currentDeck, text, from]) // eslint-disable-line
	
	return (
		<>
			<Decks
				decks={decks}
				currentDeck={currentDeck}
				text={text}
				from={from}
			/>
			<Sections
				currentDeck={currentDeck}
				currentSection={currentSection}
				text={text}
				from={from}
			/>
			{currentDeck && currentSection && (
				<Editors
					deck={currentDeck}
					section={currentSection}
					text={text}
				/>
			)}
		</>
	)
}
