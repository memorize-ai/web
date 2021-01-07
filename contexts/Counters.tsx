import React, { createContext, Dispatch, ReactNode, useReducer } from 'react'

import { Counter } from 'models/Counters'
import Action, { ActionType } from 'actions/Action'

export interface CountersState {
	decks: number | null
}

export type CountersAction = Action<{ key: Counter, value: number | null }>

const initialState: CountersState = {
	decks: null
}

const reducer = (state: CountersState, { type, payload }: CountersAction) =>
	type === ActionType.SetCounterKey
		? { ...state, [payload.key]: payload.value }
		: state

const Context = createContext<[CountersState, Dispatch<CountersAction>]>([initialState, console.log])
export default Context

export const CountersProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
