import { atom } from 'recoil'

import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'

export interface DecksState {
	decks: Deck[]
	ownedDecks: Deck[]
	loadingState: LoadingState
	selectedDeck: Deck | null
}

const decksState = atom<DecksState>({
	key: 'decks',
	default: {
		decks: [],
		ownedDecks: [],
		loadingState: LoadingState.None,
		selectedDeck: null
	},
	dangerouslyAllowMutability: true
})

export default decksState
