import { useContext, useEffect, useMemo } from 'react'

import firebase from '../firebase'
import DecksContext from '../contexts/Decks'
import { updateDeck, removeDeck } from '../actions'
import Deck from '../models/Deck'
import { handleError } from '../utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default (slugId: string | null | undefined) => {
	const [{ decks, ownedDecks }, dispatch] = useContext(DecksContext)
	
	const deck = useMemo(() => (
		ownedDecks.find(deck => deck.slugId === slugId)
			?? decks.find(deck => deck.slugId === slugId)
	), [slugId, ownedDecks, decks])
	
	useEffect(() => {
		if (deck || !slugId || Deck.isObserving[slugId])
			return
		
		Deck.isObserving[slugId] = true
		
		firestore
			.collection('decks')
			.where('slugId', '==', slugId)
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
				handleError
			)
	}, [deck, slugId])
	
	return {
		deck: deck ?? null,
		hasDeck: ownedDecks.some(deck => deck.slugId === slugId)
	}
}
