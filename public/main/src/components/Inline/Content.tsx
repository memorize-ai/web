import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import Deck from '../../models/Deck'
import Card from '../../models/Card'
import { handleError } from '../../utils'
import Navbar from './Navbar'

import 'firebase/firestore'

const firestore = firebase.firestore()

const InlineContent = () => {
	const { deckId, sectionId } = useParams()
	
	const [deck, setDeck] = useState(null as Deck | null)
	const [cards, setCards] = useState(null as Card[] | null)
	const [index, setIndex] = useState(0)
	
	const card = useMemo(() => (
		cards ? cards[index] : null
	), [cards, index])
	
	useEffect(() => (
		firestore.doc(`decks/${deckId}`).onSnapshot(
			snapshot => setDeck(Deck.fromSnapshot(snapshot, null)),
			handleError
		)
	), [deckId, setDeck])
	
	useEffect(() => {
		if (cards)
			return
		
		firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', sectionId)
			.get()
			.then(({ docs }) => {
				setCards(docs.map(doc => Card.fromSnapshot(doc, null)))
			})
			.catch(handleError)
	}, [deckId, sectionId, cards, setCards])
	
	const next = useCallback(() => {
		setIndex(index => index + 1)
	}, [setIndex])
	
	return (
		<>
			<Navbar deck={deck} />
			{card
				? <p dangerouslySetInnerHTML={{ __html: card.front }} />
				: 'Loading...'
			}
			<button onClick={next}>
				Next
			</button>
		</>
	)
}

export default InlineContent
