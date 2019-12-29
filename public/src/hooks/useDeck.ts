import { useState, useEffect } from 'react'

import firebase from '../firebase'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default (deckId: string) => {
	const [deck, setDeck] = useState(null as firebase.firestore.DocumentData | null)
	
	useEffect(() => {
		firestore.doc(`decks/${deckId}`).get()
			.then(snapshot =>
				setDeck(snapshot.data() ?? {})
			)
			.catch(error => {
				alert('Oh no! An error occurred. Please reload the page to try again')
				console.error(error)
			})
	}, [deckId])
	
	return deck
}
