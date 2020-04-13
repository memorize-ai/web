import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import User from '../models/User'

export interface AuthModalState {
	isShowing: boolean
	callback: ((user: User) => void) | null
}

export type AuthModalAction = Action<
	| boolean // SetAuthModalIsShowing
	| ((user: User) => void) | null // SetAuthModalCallback
>

const initialState: AuthModalState = {
	isShowing: false,
	callback: null
}

const reducer = (state: AuthModalState, { type, payload }: AuthModalAction) => {
	switch (type) {
		case ActionType.SetAuthModalIsShowing:
			return { ...state, isShowing: payload as boolean }
		case ActionType.SetAuthModalCallback:
			return { ...state, callback: payload as ((user: User) => void) | null }
		default:
			return state
	}
}

const Context = createContext<[AuthModalState, Dispatch<AuthModalAction>]>([
	initialState,
	console.log
])
export default Context

export const AuthModalProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
