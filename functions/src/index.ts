import { initializeApp } from 'firebase-admin'

initializeApp({
	storageBucket: 'memorize-ai.appspot.com'
})

export { default as app } from './app'
