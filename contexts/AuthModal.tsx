import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'
import User from 'models/User'
import AuthenticationMode from 'models/AuthenticationMode'

export interface AuthModalState {
	isShowing: boolean
	callback: ((user: User) => void) | null
	mode: AuthenticationMode
	initialXp: number
}

export type AuthModalAction = Action<
	| boolean // SetAuthModalIsShowing
	| ((user: User) => void) | null // SetAuthModalCallback
	| AuthenticationMode // SetAuthModalMode
	| number // SetAuthModalInitialXp
>

const initialState: AuthModalState = {
	isShowing: false,
	callback: null,
	mode: AuthenticationMode.LogIn,
	initialXp: 0
}

const reducer = (state: AuthModalState, { type, payload }: AuthModalAction) => {
	switch (type) {
		case ActionType.SetAuthModalIsShowing:
			return { ...state, isShowing: payload as boolean }
		case ActionType.SetAuthModalCallback:
			return { ...state, callback: payload as ((user: User) => void) | null }
		case ActionType.SetAuthModalMode:
			return { ...state, mode: payload as AuthenticationMode }
		case ActionType.SetAuthModalInitialXp:
			return { ...state, initialXp: payload as number }
		default:
			return state
	}
}

const Context = createContext<[AuthModalState, Dispatch<AuthModalAction>]>([
	initialState,
	console.log
])
export default Context

export const AuthModalProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
