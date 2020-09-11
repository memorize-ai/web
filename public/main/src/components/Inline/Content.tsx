import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import Deck from '../../models/Deck'
import PerformanceRating from '../../models/PerformanceRating'
import { handleError } from '../../utils'
import Navbar from './Navbar'
import Main from './Main'

import styles from '../../scss/components/Inline/index.module.scss'

import 'firebase/firestore'

const firestore = firebase.firestore()

const InlineContent = () => {
	const { deckId, sectionId } = useParams()
	const [deck, setDeck] = useState(null as Deck | null)
	
	const action = useCallback(() => {
		// TODO: Either log in or complete
	}, [])
	
	const rate = useCallback((rating: PerformanceRating) => {
		// TODO: Rate
	}, [])
	
	useEffect(() => (
		firestore.doc(`decks/${deckId}`).onSnapshot(
			snapshot => setDeck(Deck.fromSnapshot(snapshot, null)),
			handleError
		)
	), [deckId, setDeck])
	
	return (
		<div className={styles.root}>
			<Navbar deck={deck} action={action} />
			<Main deck={deck} rate={rate} />
		</div>
	)
}

export default InlineContent
