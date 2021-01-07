import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import Deck from 'models/Deck'
import Action, { ActionType } from 'actions/Action'

export type SimilarDecksState = Record<string, Deck[]>

export type SimilarDecksAction = Action<{
	deckId: string
	decks: Deck[]
}>

const initialState: SimilarDecksState = {}

const reducer = (
	state: SimilarDecksState,
	{ type, payload }: SimilarDecksAction
) => {
	if (type !== ActionType.SetSimilarDecks) return state

	const { deckId, decks } = payload as {
		deckId: string
		decks: Deck[]
	}

	return { ...state, [deckId]: decks }
}

const Context = createContext<
	[SimilarDecksState, Dispatch<SimilarDecksAction>]
>([initialState, console.log])
export default Context

export const SimilarDecksProvider = ({
	children
}: {
	children?: ReactNode
}) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
