import { SetStateAction, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import state, {
	AddCardsState,
	getInitialCards,
	getEmptyCard
} from 'state/addCards'

export interface AddCardsUpdateObject {
	front?: string
	back?: string
}

const useAddCardsState = () => {
	const [cards, _setCards] = useRecoilState(state)

	const setCards = useCallback(
		(newCards: SetStateAction<AddCardsState>) => {
			_setCards(previousCards => {
				const cards =
					typeof newCards === 'function' ? newCards(previousCards) : newCards
				return cards.length ? cards : getInitialCards()
			})
		},
		[_setCards]
	)

	return {
		cards,
		setCards,
		addCard: useCallback(() => setCards(cards => [...cards, getEmptyCard()]), [
			setCards
		]),
		updateCard: useCallback(
			(id: string, update: AddCardsUpdateObject) =>
				setCards(cards =>
					cards.map(card => (card.id === id ? { ...card, ...update } : card))
				),
			[setCards]
		),
		removeCard: useCallback(
			(id: string) => setCards(cards => cards.filter(card => card.id !== id)),
			[setCards]
		)
	}
}

export default useAddCardsState
