import { atom } from 'recoil'

import PreviewDeck from 'models/PreviewDeck'

export type PreviewDeckState = PreviewDeck | null

const previewDeckState = atom<PreviewDeckState>({
	key: 'previewDeck',
	default: null
})

export default previewDeckState
