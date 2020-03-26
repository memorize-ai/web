import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'

export type ExpandedSectionsState = Record<string, string[]>
export type ExpandedSectionsAction = Action<{ deckId: string, sectionId: string }>

const initialState: ExpandedSectionsState = {}

const reducer = (
	state: ExpandedSectionsState,
	{ type, payload: { deckId, sectionId } }: ExpandedSectionsAction
) => {
	if (type !== ActionType.ToggleSectionExpanded)
		return state
	
	const sections = state[deckId] ?? []
	
	return {
		...state,
		[deckId]: sections.includes(sectionId)
			? sections.filter(_sectionId => _sectionId !== sectionId)
			: [...sections, sectionId]
	}
}

const Context = createContext<[ExpandedSectionsState, Dispatch<ExpandedSectionsAction>]>([
	initialState,
	console.log
])
export default Context

export const ExpandedSectionsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
