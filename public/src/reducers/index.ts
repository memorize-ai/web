import { combineReducers } from 'redux'

import decks from './decks'
import isObservingDecks from './isObservingDecks'

const reducers = combineReducers({
	decks,
	isObservingDecks
})

export default reducers

export type State = ReturnType<typeof reducers>
