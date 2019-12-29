import { useState, useEffect } from 'react'

import firebase from '../firebase'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default (deckId: string, sectionId: string) => {
	const [section, setSection] = useState(null as firebase.firestore.DocumentData | null)
	
	useEffect(() => {
		firestore.doc(`decks/${deckId}/sections/${sectionId}`).get()
			.then(snapshot =>
				setSection(snapshot.data() ?? {})
			)
			.catch(error => {
				alert('Oh no! An error occurred. Please reload the page to try again')
				console.error(error)
			})
	}, [deckId, sectionId])
	
	return section
}
