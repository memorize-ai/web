import { useContext, useEffect } from 'react'

import firebase from '../firebase'
import DecksContext from '../contexts/Decks'
import { updateDeck, removeDeck } from '../actions'
import Deck from '../models/Deck'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default (slug: string | null | undefined) => {
	const [{ decks, ownedDecks }, dispatch] = useContext(DecksContext)
	
	const deck = ownedDecks.find(deck => deck.slug === slug)
		?? decks.find(deck => deck.slug === slug)
	
	useEffect(() => {
		if (deck || !slug || Deck.isObserving[slug])
			return
		
		Deck.isObserving[slug] = true
		
		firestore
			.collection('decks')
			.where('slug', '==', slug)
			.limit(1)
			.onSnapshot(
				snapshot => {
					for (const { type, doc } of snapshot.docChanges())
						switch (type) {
							case 'added':
							case 'modified':
								dispatch(updateDeck(doc))
								break
							case 'removed':
								dispatch(removeDeck(doc.id))
								break
						}
				},
				error => {
					alert(error.message)
					console.error(error)
				}
			)
	}, [deck, slug]) // eslint-disable-line
	
	return {
		deck: deck ?? null,
		hasDeck: ownedDecks.some(deck => deck.slug === slug)
	}
}
