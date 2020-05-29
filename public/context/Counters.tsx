import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'
import { Counter } from 'models/Counters'

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

export const CountersProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
