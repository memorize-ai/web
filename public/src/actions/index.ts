import { ActionType } from './Action'
import firebase from '../firebase'

export const setIsObservingDecks = (value: boolean) => ({
	type: ActionType.SetIsObservingDecks,
	payload: value
})

export const updateDeck = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateDeck,
	payload: snapshot
})

export const removeDeck = (id: string) => ({
	type: ActionType.RemoveDeck,
	payload: id
})

export const setIsObservingSections = (deckId: string, value: boolean) => ({
	type: ActionType.SetIsObservingSections,
	payload: { deckId, value }
})

export const addSection = (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.AddSection,
	payload: { deckId, snapshot }
})

export const updateSection = (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateSection,
	payload: { deckId, snapshot }
})

export const removeSection = (deckId: string, sectionId: string) => ({
	type: ActionType.RemoveSection,
	payload: { deckId, sectionId }
})
