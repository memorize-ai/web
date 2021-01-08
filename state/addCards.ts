import { atom } from 'recoil'
import { v4 as uuid } from 'uuid'

import { CardDraft } from 'models/Card'

export type AddCardsState = CardDraft[]

export const getEmptyCard = (): CardDraft => ({
	id: uuid(),
	front: '',
	back: ''
})

export const getInitialCards = (): AddCardsState => [getEmptyCard()]

const addCardsState = atom<AddCardsState>({
	key: 'addCards',
	default: getInitialCards()
})

export default addCardsState
