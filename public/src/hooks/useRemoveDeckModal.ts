import { useState, useCallback } from 'react'

import Deck from '../models/Deck'
import { RemoveDeckModalProps } from '../components/shared/Modal/RemoveDeck'

export default () => {
	const [deck, setDeck] = useState(null as Deck | null)
	const [isShowing, setIsShowing] = useState(false)
	
	return [
		useCallback((deck: Deck) => {
			setDeck(deck)
			setIsShowing(true)
		}, [setDeck, setIsShowing]),
		{ deck, isShowing, setIsShowing } as RemoveDeckModalProps
	] as const
}
