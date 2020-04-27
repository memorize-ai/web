import { initializeApp } from 'firebase-admin'

import { DEFAULT_STORAGE_BUCKET } from './constants'

initializeApp({
	storageBucket: DEFAULT_STORAGE_BUCKET
})

export { default as api } from './API'

export * from './User/functions'
export * from './Deck/functions'
export * from './Section/functions'
export * from './Card/functions'
export * from './Topic/functions'
