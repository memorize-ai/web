import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'
import LoadingState from 'models/LoadingState'

export interface DeckImageUrlState {
	url: string | null
	loadingState: LoadingState
}

export type DeckImageUrlsState = Record<string, DeckImageUrlState>

export type DeckImageUrlsAction = Action<
	| { deckId: string, url: string | null } // SetDeckImageUrl
	| { deckId: string, loadingState: LoadingState } // SetDeckImageUrlLoadingState
>

const initialState: DeckImageUrlsState = {}

const reducer = (state: DeckImageUrlsState, { type, payload }: DeckImageUrlsAction) => {
	switch (type) {
		case ActionType.SetDeckImageUrl: {
			const { deckId, url } = payload as { deckId: string, url: string | null }
			const oldState = state[deckId]
			
			return {
				...state,
				[deckId]: {
					url,
					loadingState: oldState ? oldState.loadingState : LoadingState.None
				}
			}
		}
		case ActionType.SetDeckImageUrlLoadingState: {
			const { deckId, loadingState } = payload as { deckId: string, loadingState: LoadingState }
			const oldState = state[deckId]
			
			return {
				...state,
				[deckId]: {
					url: oldState ? oldState.url : null,
					loadingState
				}
			}
		}
		default:
			return state
	}
}

const Context = createContext<[DeckImageUrlsState, Dispatch<DeckImageUrlsAction>]>([initialState, console.log])
export default Context

export const DeckImageUrlsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
