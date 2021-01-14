import { useMemo } from 'react'

import Deck from 'models/Deck'
import useDecks from './useDecks'

const useCreatedDecks = (initialDecks: Deck[]) => {
	const [decks] = useDecks()

	return useMemo(
		() =>
			initialDecks.map(deck => decks.find(({ id }) => id === deck.id) ?? deck),
		[initialDecks, decks]
	)
}

export default useCreatedDecks
