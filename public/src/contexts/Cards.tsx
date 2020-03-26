import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Card from '../models/Card'

export type CardsState = Record<string, Card[]>

export type CardsAction = Action<
	| { sectionId: string, snapshot: firebase.firestore.DocumentSnapshot } // AddCard, UpdateCard, UpdateCardUserData
	| { sectionId: string, cardId: string } // RemoveCard
>

const initialState: CardsState = {}

const reducer = (state: CardsState, { type, payload }: CardsAction) => {
	switch (type) {
		case ActionType.AddCard: {
			const { sectionId, snapshot } = payload as {
				sectionId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[sectionId]: [
					...state[sectionId] ?? [],
					Card.fromSnapshot(snapshot, null)
				]
			}
		}
		case ActionType.UpdateCard: {
			const { sectionId, snapshot } = payload as {
				sectionId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[sectionId]: state[sectionId]?.map(card =>
					card.id === snapshot.id
						? card.updateFromSnapshot(snapshot)
						: card
				)
			}
		}
		case ActionType.UpdateCardUserData: {
			const { sectionId, snapshot } = payload as {
				sectionId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[sectionId]: state[sectionId]?.map(card =>
					card.id === snapshot.id
						? card.updateUserDataFromSnapshot(snapshot)
						: card
				)
			}
		}
		case ActionType.RemoveCard: {
			const { sectionId, cardId } = payload as {
				sectionId: string
				cardId: string
			}
			
			return {
				...state,
				[sectionId]: state[sectionId]?.filter(card =>
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
