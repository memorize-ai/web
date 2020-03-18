import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
} from '../../../actions'
import { State } from '../../../reducers'
import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useQuery from '../../../hooks/useQuery'
import useCurrentUser from '../../../hooks/useCurrentUser'

export interface CreateCardPopUpEditorOwnProps {
	match: {
		params: {
			deckId: string
			sectionId: string
		}
	}
}

export interface CreateCardPopUpEditorProps {
	deck: Deck | undefined
	section: Section | undefined
	
	isObservingDecks: boolean
	setIsObservingDecks: (value: boolean) => void
	updateDeck: (snapshot: firebase.firestore.DocumentSnapshot) => void
	removeDeck: (id: string) => void
	
	setIsObservingSections: (deckId: string, value: boolean) => void
	addSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	removeSection: (deckId: string, sectionId: string) => void
}

const CreateCardPopUpEditor = ({
	deck,
	section,
	
	isObservingDecks,
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
}: CreateCardPopUpEditorProps) => {
	const { deckId } = useParams()
	const text = useQuery().get('text') ?? ''
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (isObservingDecks || deck || !currentUser)
			return
		
		setIsObservingDecks(true)
		Deck.observeForUserWithId(currentUser.uid, {
			updateDeck,
			removeDeck
		})
	}, [deck, currentUser]) // eslint-disable-line
	
	useEffect(() => {
		if (!deckId || (deck && deck.isObservingSections))
			return
		
		setIsObservingSections(deckId, true)
		Section.observeForDeckWithId(deckId, {
			addSection,
			updateSection,
			removeSection
		})
	}, [deckId, deck]) // eslint-disable-line
	
	return (
		<>
			<p>{text}</p>
			<p>{deck?.name ?? 'Loading...'}</p>
			<p>{section?.name ?? 'Loading...'}</p>
		</>
	)
}

const mapStateToProps = (
	{ decks }: State,
	{ match: { params: { deckId, sectionId } } }: CreateCardPopUpEditorOwnProps
) => {
	const deck = decks.find(deck => deck.id === deckId)
	
	return {
		deck,
		section: deck?.sections.find(section => section.id === sectionId)
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
})(CreateCardPopUpEditor)
