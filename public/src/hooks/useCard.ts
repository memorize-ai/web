import { useContext, useEffect } from 'react'

import firebase from '../firebase'
import CardsContext from '../contexts/Cards'
import { setCard } from '../actions'
import Card from '../models/Card'
import { compose } from '../utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

const cardFromSectionMap = (id: string, map: Record<string, any>) => {
	const card: Card | undefined = map[id]
	
	if (card)
		return card
	
	for (const cards of Object.values(map)) {
		if (!Array.isArray(cards))
			continue
		
		for (const card of cards as Card[])
			if (card.id === id)
				return card
	}
	
	return null
}

export default (deckId: string | null | undefined, cardId: string | null | undefined) => {
	const [state, dispatch] = useContext(CardsContext)
	
	const card = cardId
		? cardFromSectionMap(cardId, state)
		: null
	
	useEffect(() => {
		if (card || !(deckId && cardId) || Card.isObserving[cardId])
			return
		
		Card.isObserving[cardId] = true
		
		firestore.doc(`decks/${deckId}/cards/${cardId}`).onSnapshot(
			compose(dispatch, setCard),
			error => {
				alert(error.message)
				console.error(error)
			}
		)
	}, [card, deckId, cardId, dispatch])
	
	return card
}
