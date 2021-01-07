import { useState, useCallback } from 'react'

import Deck from 'models/Deck'
import { RemoveDeckModalProps } from 'components/Modal/RemoveDeck'

const useRemoveDeckModal = () => {
	const [deck, setDeck] = useState(null as Deck | null)
	const [isShowing, setIsShowing] = useState(false)

	return [
		useCallback(
			(deck: Deck) => {
				setDeck(deck)
				setIsShowing(true)
			},
			[setDeck, setIsShowing]
		),
		{ deck, isShowing, setIsShowing } as RemoveDeckModalProps
	] as const
}

export default useRemoveDeckModal
