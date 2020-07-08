import { initializeApp } from 'firebase-admin'

import { DEFAULT_STORAGE_BUCKET } from './constants'

initializeApp({
	storageBucket: DEFAULT_STORAGE_BUCKET
})

export { default as app } from './App'

export * from './User/functions'
export * from './Deck/functions'
export * from './Section/functions'
export * from './Card/functions'
export * from './Topic/functions'
export * from './CardPoster/functions'
export * from './Email/functions'
export * from './PreviewDeck/functions'
