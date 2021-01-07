import { useContext, useEffect } from 'react'

import CardsContext from 'contexts/Cards'
import { setCards } from 'actions'
import Card from 'models/Card'

const useAllCards = (
	deckId: string | null | undefined
): Record<string, Card[]> | null => {
	const [state, dispatch] = useContext(CardsContext)
	const sections = (deckId && (state[deckId] as Record<string, Card[]>)) || null

	useEffect(() => {
		if (!deckId || Card.observers[deckId] || sections) return

		Card.observers[deckId] = true

		Card.getAllForDeck(deckId).then(cards => dispatch(setCards(deckId, cards)))
	}, [sections, deckId, dispatch])

	return sections
}

export default useAllCards
