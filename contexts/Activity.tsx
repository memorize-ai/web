import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'
import ActivityNode from 'models/ActivityNode'

export type ActivityState = Record<number, ActivityNode>
export type ActivityAction = Action<ActivityNode>

const initialState: ActivityState = {}

const reducer = (state: ActivityState, { type, payload }: ActivityAction) =>
	type === ActionType.SetActivityNode
		? { ...state, [payload.day]: payload }
		: state

const Context = createContext<[ActivityState, Dispatch<ActivityAction>]>([
	initialState,
	console.log
])
export default Context

export const ActivityProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
