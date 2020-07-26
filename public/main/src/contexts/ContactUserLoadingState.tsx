import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import LoadingState from '../models/LoadingState'

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

export const ContactUserLoadingStateProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
