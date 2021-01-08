import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import cardsState from 'state/cards'
import Card from 'models/Card'

const useAllCards = (deckId: string) => {
	const [cards, setCards] = useRecoilState(cardsState)

	const sections =
		(cards[deckId] as Record<string, Card[] | undefined> | undefined) ?? null
	const didLoad = Boolean(sections)

	useEffect(() => {
		if (Card.observers[deckId] || didLoad) return

		Card.observers[deckId] = true
		Card.getAllForDeck(deckId).then(sections => {
			setCards(state => ({ ...state, [deckId]: sections }))
		})
	}, [deckId, didLoad, setCards])

	return sections
}

export default useAllCards
