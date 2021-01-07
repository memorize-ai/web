import { createContext, Dispatch, ReactNode, useReducer } from 'react'
import groupBy from 'lodash/groupBy'

import Card from 'models/Card'
import firebase from 'lib/firebase'
import Action, { ActionType } from 'actions/Action'

export type CardsState = Record<string, Card | Card[] | Record<string, Card[]>>

export type CardsAction = Action<
	| string // InitializeCards
	| { parentId: string; cards: Card[] } // SetCards
	| firebase.firestore.DocumentSnapshot // SetCard
	| { parentId: string; snapshot: firebase.firestore.DocumentSnapshot } // AddCard, UpdateCard, UpdateCardUserData
	| { parentId: string; cardId: string } // RemoveCard
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
		case ActionType.SetCards: {
			const { parentId, cards } = payload as {
				parentId: string
				cards: Card[]
			}

			return {
				...state,
				[parentId]: groupBy(cards, 'sectionId')
			}
		}
		case ActionType.SetCard: {
			const card = Card.fromSnapshot(
				payload as firebase.firestore.DocumentSnapshot,
				null
			)

			return { ...state, [card.id]: card }
		}
		case ActionType.AddCard: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}

			return {
				...state,
				[parentId]: [
					...((state[parentId] as Card[] | undefined) ?? []),
					Card.fromSnapshot(snapshot, null)
				]
			}
		}
		case ActionType.UpdateCard: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			const cards = (state[parentId] as Card[] | undefined) ?? []

			return {
				...state,
				[parentId]: cards.map(card =>
					card.id === snapshot.id ? card.updateFromSnapshot(snapshot) : card
				)
			}
		}
		case ActionType.UpdateCardUserData: {
			const { parentId, snapshot } = payload as {
				parentId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			const cards = (state[parentId] as Card[] | undefined) ?? []

			return {
				...state,
				[parentId]: cards.map(card =>
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
			const cards = (state[parentId] as Card[] | undefined) ?? []

			return {
				...state,
				[parentId]: cards.filter(card => card.id !== cardId)
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

export const CardsProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
