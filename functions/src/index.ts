import { initializeApp } from 'firebase-admin'

initializeApp()

export {
	deckCreated,
	deckUpdated,
	deckDeleted,
	deckUserNodeCreated,
	deckUserNodeDeleted
} from './Deck/functions'

export {
	sectionDeleted
} from './Section/functions'

export {
	cardCreated,
	cardUpdated,
	cardDeleted
} from './Card/functions'

export {
	userCreated,
	userUpdated,
	userDeleted
} from './User/functions'
