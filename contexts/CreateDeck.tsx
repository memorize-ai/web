import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'

export interface CreateDeckState {
	image: File | null
	name: string
	subtitle: string
	description: string
	topics: string[]
}

export type CreateDeckAction = Action<
	| File | null // SetCreateDeckImage
	| string // SetCreateDeckName, SetCreateDeckSubtitle, SetCreateDeckDescription
	| string[] // SetCreateDeckTopics
>

const initialState: CreateDeckState = {
	image: null,
	name: '',
	subtitle: '',
	description: '',
	topics: []
}

const reducer = (state: CreateDeckState, { type, payload }: CreateDeckAction) => {
	switch (type) {
		case ActionType.SetCreateDeckImage:
			return { ...state, image: payload as File | null }
		case ActionType.SetCreateDeckName:
			return { ...state, name: payload as string }
		case ActionType.SetCreateDeckSubtitle:
			return { ...state, subtitle: payload as string }
		case ActionType.SetCreateDeckDescription:
			return { ...state, description: payload as string }
		case ActionType.SetCreateDeckTopics:
			return { ...state, topics: payload as string[] }
		default:
			return state
	}
}

const Context = createContext<[CreateDeckState, Dispatch<CreateDeckAction>]>([
	initialState,
	console.log
])
export default Context

export const CreateDeckProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
