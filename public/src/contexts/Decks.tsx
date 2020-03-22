import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Deck from '../models/Deck'
import DeckUserData from '../models/Deck/UserData'

export interface DecksState {
	decks: Deck[]
	isObservingDecks: boolean
}

export type DecksAction = Action<
	| boolean // SetIsObservingDecks
	| { snapshot: firebase.firestore.DocumentSnapshot, userDataSnapshot: firebase.firestore.DocumentSnapshot } // UpdateDeck
	| firebase.firestore.DocumentSnapshot // UpdateDeckUserData
	| string // RemoveDeck
	| { deckId: string, value: boolean } // SetIsObservingSections
	| { deckId: string, snapshot: firebase.firestore.DocumentSnapshot } // AddSection, UpdateSection
	| { deckId: string, sectionId: string } // RemoveSection
>

const initialState: DecksState = { decks: [], isObservingDecks: false }

const reducer = (state: DecksState, { type, payload }: DecksAction) => {
	switch (type) {
		case ActionType.SetIsObservingDecks:
			return { ...state, isObservingDecks: payload as boolean }
		case ActionType.UpdateDeck: {
			const { snapshot, userDataSnapshot } = payload as {
				snapshot: firebase.firestore.DocumentSnapshot
				userDataSnapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				decks: state.decks.some(deck => deck.id === snapshot.id)
					? state.decks.map(deck =>
						deck.id === snapshot.id
							? deck.updateFromSnapshot(snapshot)
							: deck
					)
					: [...state.decks, Deck.fromSnapshot(
						snapshot,
						DeckUserData.fromSnapshot(userDataSnapshot)
					)]
			}
		}
		case ActionType.UpdateDeckUserData: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot
			
			return {
				...state,
				decks: state.decks.map(deck =>
					deck.id === snapshot.id
						? deck.updateUserDataFromSnapshot(snapshot)
						: deck
				)
			}
		}
		case ActionType.RemoveDeck:
			return { ...state, decks: state.decks.filter(deck => deck.id !== payload) }
		case ActionType.SetIsObservingSections: {
			const { deckId, value } = payload as {
				deckId: string
				value: boolean
			}
			
			return {
				...state,
				decks: state.decks.map(deck =>
					deck.id === deckId
						? deck.setIsObservingSections(value)
						: deck
				)
			}
		}
		case ActionType.AddSection: {
			const { deckId, snapshot } = payload as {
				deckId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				decks: state.decks.map(deck =>
					deck.id === deckId
						? deck.addSection(snapshot)
						: deck
				)
			}
		}
		case ActionType.UpdateSection: {
			const { deckId, snapshot } = payload as {
				deckId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				decks: state.decks.map(deck =>
					deck.id === deckId
						? deck.updateSection(snapshot)
						: deck
				)
			}
		}
		case ActionType.RemoveSection: {
			const { deckId, sectionId } = payload as {
				deckId: string
				sectionId: string
			}
			
			return {
				...state,
				decks: state.decks.map(deck =>
					deck.id === deckId
						? deck.removeSection(sectionId)
						: deck
				)
			}
		}
		default:
			return state
	}
}

const Context = createContext<[DecksState, Dispatch<DecksAction>]>([initialState, console.log])
export default Context

export const DecksProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
