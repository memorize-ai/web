import { useContext, useEffect } from 'react'

import CardsContext from '../contexts/Cards'
import { setCards } from '../actions'
import Card from '../models/Card'

export default (deckId: string): Card[] | null => {
	const [{ [deckId]: cards }, dispatch] = useContext(CardsContext)
	
	useEffect(() => {
		if (Card.observers[deckId] || cards)
			return
		
		Card.observers[deckId] = true
		
		Card.getAllForDeck(deckId).then(cards => dispatch(setCards(deckId, cards)))
	}, [cards, deckId, dispatch])
	
	return cards ?? null
}
