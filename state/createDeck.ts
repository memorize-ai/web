import { atom } from 'recoil'

export interface CreateDeckState {
	image: File | null
	name: string
	subtitle: string
	description: string
	topics: string[]
}

export const initialState: CreateDeckState = {
	image: null,
	name: '',
	subtitle: '',
	description: '',
	topics: []
}

const createDeckState = atom<CreateDeckState>({
	key: 'createDeck',
	default: initialState
})

export default createDeckState
