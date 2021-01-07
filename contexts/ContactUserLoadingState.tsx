import React, { createContext, Dispatch, ReactNode, useReducer } from 'react'

import LoadingState from 'models/LoadingState'
import Action, { ActionType } from 'actions/Action'

export type ContactUserLoadingStateState = Record<string, LoadingState>

export type ContactUserLoadingStateAction = Action<{
	id: string
	loadingState: LoadingState
}>

const initialState: ContactUserLoadingStateState = {}

const reducer = (state: ContactUserLoadingStateState, { type, payload }: ContactUserLoadingStateAction) =>
	type === ActionType.SetContactUserLoadingState
		? { ...state, [payload.id]: payload.loadingState }
		: state

const Context = createContext<[ContactUserLoadingStateState, Dispatch<ContactUserLoadingStateAction>]>([
	initialState,
	console.log
])
export default Context

export const ContactUserLoadingStateProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
