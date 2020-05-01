import { useContext, useEffect } from 'react'

import CardsContext from '../contexts/Cards'
import { setCards } from '../actions'
import Card from '../models/Card'

export default (deckId: string | null | undefined): Record<string, Card[]> | null => {
	const [state, dispatch] = useContext(CardsContext)
	
	const sections: Record<string, Card[]> | null = (deckId && state[deckId] as any) || null
	
	useEffect(() => {
		if (!deckId || Card.observers[deckId] || sections)
			return
		
		Card.observers[deckId] = true
		
		Card.getAllForDeck(deckId)
			.then(cards => dispatch(setCards(deckId, cards)))
	}, [sections, deckId]) // eslint-disable-line
	
	return sections
}
