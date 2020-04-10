import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Deck from '../models/Deck'

export type SimilarDecksState = Record<string, Deck[]>

export type SimilarDecksAction = Action<
	| string // InitializeSimilarDecks
	| { deckId: string, decks: Deck[] } // SetSimilarDecks
>

const initialState: SimilarDecksState = {}

const reducer = (state: SimilarDecksState, { type, payload }: SimilarDecksAction) => {
	switch (type) {
		case ActionType.InitializeSimilarDecks: {
			const deckId = payload as string
			
			return {
				...state,
				[deckId]: state[deckId] ?? []
			}
		}
		case ActionType.SetSimilarDecks: {
			const { deckId, decks } = payload as {
				deckId: string
				decks: Deck[]
			}
			
			return { ...state, [deckId]: decks }
		}
		default:
			return state
	}
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
