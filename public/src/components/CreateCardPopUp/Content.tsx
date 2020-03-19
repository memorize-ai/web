import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import {
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
} from '../../actions'
import { State } from '../../reducers'
import Deck from '../../models/Deck'
import Section from '../../models/Section'
import useQuery from '../../hooks/useQuery'
import firebase from '../../firebase'
import Decks from './Decks'
import Sections from './Sections'
import Editors from './Editors'

import 'firebase/analytics'

export interface CreateCardPopUpOwnProps {
	currentUser: firebase.User
	deckId: string | undefined
	sectionId: string | undefined
}

export interface CreateCardPopUpProps {
	currentUser: firebase.User
	decks: Deck[]
	
	deck?: Deck
	section?: Section
	
	isObservingDecks: boolean
	setIsObservingDecks: (value: boolean) => void
	updateDeck: (snapshot: firebase.firestore.DocumentSnapshot) => void
	removeDeck: (id: string) => void
	
	setIsObservingSections: (deckId: string, value: boolean) => void
	addSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	removeSection: (deckId: string, sectionId: string) => void
}

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

const CreateCardPopUp = ({
	currentUser,
	decks: unfilteredDecks,
	
	deck: currentDeck,
	section: currentSection,
	
	isObservingDecks,
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
}: CreateCardPopUpProps) => {
	const { deckId } = useParams()
	const history = useHistory()
	
	const query = useQuery()
	const text = query.get('text') ?? ''
	const from = query.get('from') ?? ''
	
	const decks = unfilteredDecks.filter(deck =>
		deck.creatorId === currentUser.uid
	)
	
	useEffect(() => {
		analytics.logEvent('show_create_card_pop_up', { from })
	}, [from])
	
	useEffect(() => {
		if (isObservingDecks)
			return
		
		setIsObservingDecks(true)
		Deck.observeForUserWithId(currentUser.uid, {
			updateDeck,
			removeDeck
		})
	}, [isObservingDecks, currentUser]) // eslint-disable-line
	
	useEffect(() => {
		if (!decks.length || currentDeck || deckId)
			return
		
		history.push(getPopUpUrl({
			deck: decks[0],
			text,
			from
		}))
	}, [decks, currentDeck, text, from]) // eslint-disable-line
	
	useEffect(() => {
		if (!currentDeck || currentDeck.isObservingSections)
			return
		
		setIsObservingSections(currentDeck.id, true)
		Section.observeForDeckWithId(currentDeck.id, {
			addSection,
			updateSection,
			removeSection
		})
	}, [currentDeck]) // eslint-disable-line
	
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

const mapStateToProps = (
	{ isObservingDecks, decks }: State,
	{ deckId, sectionId }: CreateCardPopUpOwnProps
) => {
	const deck = decks.find(deck => deck.id === deckId)
	
	return {
		decks,
		deck,
		section: sectionId
			? deck?.sections.find(section => section.id === sectionId)
			: deck?.unsectionedSection,
		isObservingDecks
	}
}

export default connect(mapStateToProps, {
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
})(CreateCardPopUp)
