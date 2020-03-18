import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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

export interface CreateCardPopUpWithSelectedDeckOwnProps {
	match: {
		params: {
			deckId: string
		}
	}
}

export interface CreateCardPopUpWithSelectedDeckProps {
	deck: Deck | undefined
	
	isObservingDecks: boolean
	setIsObservingDecks: (value: boolean) => void
	updateDeck: (snapshot: firebase.firestore.DocumentSnapshot) => void
	removeDeck: (id: string) => void
	
	setIsObservingSections: (deckId: string, value: boolean) => void
	addSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
	removeSection: (deckId: string, sectionId: string) => void
}

const CreateCardPopUpWithSelectedDeck = ({
	deck,
	
	isObservingDecks,
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
}: CreateCardPopUpWithSelectedDeckProps) => {
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
		if (!deck || deck.isObservingSections)
			return
		
		setIsObservingSections(deck.id, true)
		Section.observeForDeckWithId(deck.id, {
			addSection,
			updateSection,
			removeSection
		})
	}, [deck]) // eslint-disable-line
	
	return (
		<>
			<p>{text}</p>
			<p>{deck?.name ?? 'Loading...'}</p>
			<p>Choose a section...</p>
			<ul>
				{deck?.sections.map(section => (
					<li key={section.id}>
						<Link to={`/create-card-pop-up/d/${deck.id}/s/${section.id}?text=${encodeURIComponent(text)}`}>
							{section.name}
						</Link>
					</li>
				))}
			</ul>
		</>
	)
}

const mapStateToProps = (
	{ decks }: State,
	{ match: { params: { deckId } } }: CreateCardPopUpWithSelectedDeckOwnProps
) => ({
	deck: decks.find(deck => deck.id === deckId)
})

export default connect(mapStateToProps, {
	setIsObservingDecks,
	updateDeck,
	removeDeck,
	setIsObservingSections,
	addSection,
	updateSection,
	removeSection
})(CreateCardPopUpWithSelectedDeck)
