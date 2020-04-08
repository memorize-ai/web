import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Card from '../models/Card'

export type CardsState = Record<string, Card[]>

export type CardsAction = Action<
	| string // InitializeCards
	| { parentId: string, snapshot: firebase.firestore.DocumentSnapshot } // AddCard, UpdateCard, UpdateCardUserData
	| { parentId: string, cardId: string } // RemoveCard
>

const initialState: CardsState = {}

const reducer = (state: CardsState, { type, payload }: CardsAction) => {
	switch (type) {
		case ActionType.InitializeCards: {
			const parentId = payload as string
			
			return {
				...state,
				[parentId]: state[parentId] ?? []
			}
		}
		case ActionType.AddCard: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[parentId]: [
					...state[parentId] ?? [],
					Card.fromSnapshot(snapshot, null)
				]
			}
		}
		case ActionType.UpdateCard: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[parentId]: state[parentId]?.map(card =>
					card.id === snapshot.id
						? card.updateFromSnapshot(snapshot)
						: card
				)
			}
		}
		case ActionType.UpdateCardUserData: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[parentId]: state[parentId]?.map(card =>
					card.id === snapshot.id
						? card.updateUserDataFromSnapshot(snapshot)
						: card
				)
			}
		}
		case ActionType.RemoveCard: {
			const { parentId, cardId } = payload as {
				parentId: string
				cardId: string
			}
			
			return {
				...state,
				[parentId]: state[parentId]?.filter(card =>
					card.id !== cardId
				)
			}
		}
		default:
			return state
	}
}

const Context = createContext<[CardsState, Dispatch<CardsAction>]>([
	initialState,
	console.log
])
export default Context

export const CardsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
