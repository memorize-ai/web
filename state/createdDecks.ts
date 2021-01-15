import { atomFamily } from 'recoil'

import Deck from 'models/Deck'

export type CreatedDecksState = Deck[] | null

const createdDecksState = atomFamily<CreatedDecksState, string>({
	key: 'createdDecks',
	default: null,
	dangerouslyAllowMutability: true
})

export default createdDecksState
