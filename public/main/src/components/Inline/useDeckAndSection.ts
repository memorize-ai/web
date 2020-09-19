import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import Deck from '../../models/Deck'
import { handleError } from '../../utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default () => {
	const { deckId, sectionId } = useParams()
	
	const [deck, setDeck] = useState(null as Deck | null)
	// const [hasDeck, setHasDeck] = useState(null as boolean | null)
	
	useEffect(() => (
		firestore.doc(`decks/${deckId}`).onSnapshot(
			snapshot => setDeck(Deck.fromSnapshot(snapshot, null)),
			handleError
		)
	), [deckId, setDeck])
	
	return { deck, sectionId }
}
