import { atom } from 'recoil'

import Card from 'models/Card'

export type CardsState = Record<
	string,
	Card | Card[] | Record<string, Card[]> | undefined
>

const cardsState = atom<CardsState>({
	key: 'cards',
	default: {},
	dangerouslyAllowMutability: true
})

export default cardsState
