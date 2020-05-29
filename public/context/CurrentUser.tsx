import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'
import User from 'models/User'
import LoadingState from 'models/LoadingState'

export interface CurrentUserState {
	currentUser: User | null
	currentUserLoadingState: LoadingState
	isObservingCurrentUser: boolean
}

export type CurrentUserAction = Action<
	| firebase.User | null // SetCurrentUser
	| firebase.firestore.DocumentSnapshot // UpdateCurrentUser
	| LoadingState // SetCurrentUserLoadingState
	| boolean // SetIsObservingCurrentUser
>

const initialState: CurrentUserState = {
	currentUser: null,
	currentUserLoadingState: LoadingState.None,
	isObservingCurrentUser: false
}

const reducer = (state: CurrentUserState, { type, payload }: CurrentUserAction) => {
	switch (type) {
		case ActionType.SetCurrentUser: {
			const user = payload as firebase.User | null
			
			return {
				...state,
				currentUser: user && User.fromFirebaseUser(user),
				isObservingCurrentUser: user ? state.isObservingCurrentUser : false // Reset if you signed out
			}
		}
		case ActionType.UpdateCurrentUser:
			return {
				...state,
				currentUser: state.currentUser && state.currentUser.updateFromSnapshot(
					payload as firebase.firestore.DocumentSnapshot
				)
			}
		case ActionType.SetCurrentUserLoadingState:
			return { ...state, currentUserLoadingState: payload as LoadingState }
		case ActionType.SetIsObservingCurrentUser:
			return { ...state, isObservingCurrentUser: payload as boolean }
		default:
			return state
	}
}

const Context = createContext<[CurrentUserState, Dispatch<CurrentUserAction>]>([
	initialState,
	console.log
])
export default Context

export const CurrentUserProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
