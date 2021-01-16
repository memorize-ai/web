import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Card from 'models/Card'
import cardsState, { CardsState } from 'state/cards'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

const cardFromState = (id: string, state: CardsState) => {
	const card = state[id]
	if (card instanceof Card) return card

	for (const cards of Object.values(state)) {
		if (!Array.isArray(cards)) continue
		for (const card of cards) if (card.id === id) return card
	}

	return null
}

const useCard = (deckId: string | undefined, cardId: string | undefined) => {
	const [state, setState] = useRecoilState(cardsState)
	const card = cardId ? cardFromState(cardId, state) : null

	useEffect(() => {
		if (card || !(deckId && cardId) || Card.observers.has(cardId)) return

		Card.observers.add(cardId)

		firestore.doc(`decks/${deckId}/cards/${cardId}`).onSnapshot(snapshot => {
			const card = Card.fromSnapshot(snapshot)
			setState(state => ({ ...state, [card.id]: card }))
		}, handleError)
	}, [card, deckId, cardId, setState])

	return card
}

export default useCard
