import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'
import { v4 as uuid } from 'uuid'

import { OptionalAction, ActionType } from '../actions/Action'
import { CardDraft, CardDraftUpdateObject } from '../models/Card'

export type AddCardsState = CardDraft[]

export type AddCardsAction = OptionalAction< // AddCardsAdd, AddCardsRemoveAll
	| CardDraft[] // AddCardsSet
	| { id: string, card: CardDraftUpdateObject } // AddCardsUpdate
	| string // AddCardsRemove
>

const createEmptyCard = () => ({
	id: uuid(),
	front: '',
	back: ''
})

const initialState: AddCardsState = [createEmptyCard()]

const reducer = (cards: AddCardsState, { type, payload }: AddCardsAction) => {
	switch (type) {
		case ActionType.AddCardsSet: {
			const cards = payload as CardDraft[]
			
			return cards.length
				? cards
				: initialState
		}
		case ActionType.AddCardsAdd:
			return [...cards, createEmptyCard()]
		case ActionType.AddCardsUpdate: {
			const { id, card: updateObject } = payload as {
				id: string
				card: CardDraftUpdateObject
			}
			
			return cards.map(card =>
				card.id === id
					? { ...card, ...updateObject }
					: card
			)
		}
		case ActionType.AddCardsRemove: {
			const id = payload as string
			const remainingCards = cards.filter(card => card.id !== id)
			
			return remainingCards.length
				? remainingCards
				: initialState
		}
		case ActionType.AddCardsRemoveAll:
			return initialState
		default:
			return cards
	}
}

const Context = createContext<[AddCardsState, Dispatch<AddCardsAction>]>([
	initialState,
	console.log
])
export default Context

export const AddCardsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
