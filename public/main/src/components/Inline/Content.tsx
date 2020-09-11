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
	
	const action = useCallback(() => {
		// TODO: Either log in or complete
	}, [])
	
	useEffect(() => (
		firestore.doc(`decks/${deckId}`).onSnapshot(
			snapshot => setDeck(Deck.fromSnapshot(snapshot, null)),
			handleError
		)
	), [deckId, setDeck])
	
	const next = useCallback(() => {
		setIndex(index => index + 1)
	}, [setIndex])
	
	return (
		<>
			<Navbar deck={deck} action={action} />
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
