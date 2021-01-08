import { atom } from 'recoil'

import {
	DeckSortAlgorithm,
	DEFAULT_DECK_SORT_ALGORITHM
} from 'models/Deck/Search'

export interface SearchState {
	query: string
	sortAlgorithm: DeckSortAlgorithm
}

const searchState = atom<SearchState>({
	key: 'search',
	default: {
		query: '',
		sortAlgorithm: DEFAULT_DECK_SORT_ALGORITHM
	}
})

export default searchState
