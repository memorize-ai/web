import { useContext, useEffect } from 'react'

import firebase from 'lib/firebase'
import CardsContext from 'contexts/Cards'
import { setCard } from 'actions'
import Card from 'models/Card'
import { compose, handleError } from 'lib/utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

const cardFromSectionMap = (
	id: string,
	map: Record<string, Card | undefined>
) => {
	const card = map[id]

	if (card) return card

	for (const cards of Object.values(map)) {
		if (!Array.isArray(cards)) continue

		for (const card of cards as Card[]) if (card.id === id) return card
	}

	return null
}

const useCard = (
	deckId: string | null | undefined,
	cardId: string | null | undefined
) => {
	const [state, dispatch] = useContext(CardsContext)

	const card = cardId
		? cardFromSectionMap(cardId, state as Record<string, Card | undefined>)
		: null

	useEffect(() => {
		if (card || !(deckId && cardId) || Card.isObserving[cardId]) return

		Card.isObserving[cardId] = true

		firestore
			.doc(`decks/${deckId}/cards/${cardId}`)
			.onSnapshot(compose(dispatch, setCard), handleError)
	}, [card, deckId, cardId, dispatch])

	return card
}

export default useCard
