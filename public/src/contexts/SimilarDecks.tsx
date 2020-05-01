import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Deck from '../models/Deck'

export type SimilarDecksState = Record<string, Deck[]>

export type SimilarDecksAction = Action<{
	deckId: string
	decks: Deck[]
}>

const initialState: SimilarDecksState = {}

const reducer = (state: SimilarDecksState, { type, payload }: SimilarDecksAction) => {
	if (type !== ActionType.SetSimilarDecks)
		return state
	
	const { deckId, decks } = payload as {
		deckId: string
		decks: Deck[]
	}
	
	return { ...state, [deckId]: decks }
}

const Context = createContext<[SimilarDecksState, Dispatch<SimilarDecksAction>]>([
	initialState,
	console.log
])
export default Context

export const SimilarDecksProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
