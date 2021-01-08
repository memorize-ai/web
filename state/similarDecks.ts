import { atomFamily } from 'recoil'

import Deck from 'models/Deck'

export type SimilarDecksState = Deck[] | null

const similarDecksState = atomFamily<SimilarDecksState, string>({
	key: 'similarDecks',
	default: null,
	dangerouslyAllowMutability: true
})

export default similarDecksState
