import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import Action, { ActionType } from 'actions/Action'

export interface ExpandedSectionsState {
	decks: Record<string, Record<string, boolean>>
	ownedDecks: Record<string, Record<string, boolean>>
}

export type ExpandedSectionsAction = Action<{
	deckId: string
	sectionId: string
	isOwned: boolean
}>

const initialState: ExpandedSectionsState = {
	decks: {},
	ownedDecks: {}
}

const reducer = (
	state: ExpandedSectionsState,
	{ type, payload: { deckId, sectionId, isOwned } }: ExpandedSectionsAction
) => {
	if (type !== ActionType.ToggleSectionExpanded) return state

	const key = isOwned ? 'ownedDecks' : 'decks'
	const decks = state[key]
	const sections = decks[deckId] ?? []

	return {
		...state,
		[key]: {
			...decks,
			[deckId]: {
				...sections,
				[sectionId]: !sections[sectionId]
			}
		}
	}
}

const Context = createContext<
	[ExpandedSectionsState, Dispatch<ExpandedSectionsAction>]
>([initialState, console.log])
export default Context

export const ExpandedSectionsProvider = ({
	children
}: {
	children?: ReactNode
}) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
