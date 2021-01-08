import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import Deck from 'models/Deck'
import state from 'state/decks'

const useSelectedDeck = () => {
	const [{ selectedDeck }, setState] = useRecoilState(state)

	return [
		selectedDeck,
		useCallback(
			(selectedDeck: Deck | null) =>
				setState(state => ({ ...state, selectedDeck })),
			[setState]
		)
	] as const
}

export default useSelectedDeck
