import { initializeApp } from 'firebase-admin'

import { DEFAULT_STORAGE_BUCKET } from './constants'

initializeApp({
	storageBucket: DEFAULT_STORAGE_BUCKET
})

export { default as api } from './API'

export {
	userCreated,
	userUpdated,
	userDeleted
} from './User/functions'

export {
	deckCreated,
	deckUpdated,
	deckDeleted,
	deckUserNodeCreated,
	deckUserNodeUpdated,
	deckUserNodeDeleted,
	deckDueCardCountPubSub,
	deckDueCardCountNotificationPubSub
} from './Deck/functions'

export {
	sectionDeleted
} from './Section/functions'

export {
	cardCreated,
	cardUpdated,
	cardDeleted,
	reviewCard,
	getCardPrediction
} from './Card/functions'

export {
	topicDeleted
} from './Topic/functions'
