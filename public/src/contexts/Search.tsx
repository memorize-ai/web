import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'
import _ from 'lodash'

import Action, { ActionType } from '../actions/Action'
import { DeckSortAlgorithm, DEFAULT_DECK_SORT_ALGORITHM } from '../models/Deck/Search'

export interface SearchState {
	query: string
	sortAlgorithm: DeckSortAlgorithm
}

export interface SearchActionPayload {
	query: string | null
	sortAlgorithm: DeckSortAlgorithm | null
}

export type SearchAction = Action<SearchActionPayload>

const initialState: SearchState = {
	query: '',
	sortAlgorithm: DEFAULT_DECK_SORT_ALGORITHM
}

const reducer = (state: SearchState, { type, payload }: SearchAction) =>
	type === ActionType.SetSearchState
		? { ...state, ..._.pickBy(payload, value => value !== null) as SearchState }
		: state

const Context = createContext<[SearchState, Dispatch<SearchAction>]>([
	initialState,
	console.log
])
export default Context

export const SearchProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
