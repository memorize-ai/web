import { createContext, Dispatch, ReactNode, useReducer } from 'react'

import Deck from 'models/Deck'
import DeckUserData from 'models/Deck/UserData'
import LoadingState from 'models/LoadingState'
import Action, { ActionType } from 'actions/Action'
import firebase from 'lib/firebase'

export interface DecksState {
	decks: Deck[]
	ownedDecks: Deck[]
	decksLoadingState: LoadingState
	selectedDeck: Deck | null
}

export type DecksAction = Action<
	| Deck // SetSelectedDeck
	| LoadingState // SetDecksLoadingState
	| {
			snapshot: firebase.firestore.DocumentSnapshot
			userDataSnapshot: firebase.firestore.DocumentSnapshot
	  } // UpdateOwnedDeck
	| firebase.firestore.DocumentSnapshot // UpdateDeck, UpdateDeckUserData
	| string // RemoveDeck, RemoveOwnedDeck
>

const initialState: DecksState = {
	decks: [],
	ownedDecks: [],
	decksLoadingState: LoadingState.None,
	selectedDeck: null
}

const reducer = (state: DecksState, { type, payload }: DecksAction) => {
	switch (type) {
		case ActionType.SetSelectedDeck:
			return { ...state, selectedDeck: payload as Deck }
		case ActionType.SetDecksLoadingState:
			return {
				...state,
				decksLoadingState: payload as LoadingState
			}
		case ActionType.UpdateOwnedDeck: {
			const { snapshot, userDataSnapshot } = payload as {
				snapshot: firebase.firestore.DocumentSnapshot
				userDataSnapshot: firebase.firestore.DocumentSnapshot
			}
			const ownedDecks = state.ownedDecks.some(deck => deck.id === snapshot.id)
				? state.ownedDecks.map(deck =>
						deck.id === snapshot.id ? deck.updateFromSnapshot(snapshot) : deck
				  )
				: [
						...state.ownedDecks,
						Deck.fromSnapshot(
							snapshot,
							DeckUserData.fromSnapshot(userDataSnapshot)
						)
				  ]

			return {
				...state,
				selectedDeck:
					state.selectedDeck ?? (ownedDecks.length ? ownedDecks[0] : null),
				ownedDecks
			}
		}
		case ActionType.UpdateDeck: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot

			return {
				...state,
				decks: state.decks.some(deck => deck.id === snapshot.id)
					? state.decks.map(deck =>
							deck.id === snapshot.id ? deck.updateFromSnapshot(snapshot) : deck
					  )
					: [...state.decks, Deck.fromSnapshot(snapshot)]
			}
		}
		case ActionType.UpdateDeckUserData: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot

			return {
				...state,
				ownedDecks: state.ownedDecks.map(deck =>
					deck.id === snapshot.id
						? deck.updateUserDataFromSnapshot(snapshot)
						: deck
				)
			}
		}
		case ActionType.RemoveDeck: {
			const deckId = payload as string

			return {
				...state,
				decks: state.decks.filter(deck => deck.id !== deckId)
			}
		}
		case ActionType.RemoveOwnedDeck: {
			const deckId = payload as string
			const ownedDecks = state.ownedDecks.filter(deck => deck.id !== deckId)

			return {
				...state,
				selectedDeck:
					state.selectedDeck?.id === deckId
						? ownedDecks.length
							? ownedDecks[0]
							: null
						: state.selectedDeck,
				ownedDecks
			}
		}
		default:
			return state
	}
}

const Context = createContext<[DecksState, Dispatch<DecksAction>]>([
	initialState,
	console.log
])
export default Context

export const DecksProvider = ({ children }: { children?: ReactNode }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
