import { ActionType } from './Action'
import firebase from '../firebase'
import LoadingState from '../models/LoadingState'

// Current user

export const setCurrentUser = (firebaseUser: firebase.User | null) => ({
	type: ActionType.SetCurrentUser,
	payload: firebaseUser
})

export const updateCurrentUser = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateCurrentUser,
	payload: snapshot
})

export const setCurrentUserLoadingState = (loadingState: LoadingState) => ({
	type: ActionType.SetCurrentUserLoadingState,
	payload: loadingState
})

export const setIsObservingCurrentUser = (value: boolean) => ({
	type: ActionType.SetIsObservingCurrentUser,
	payload: value
})

// Decks

export const setIsObservingDecks = (value: boolean) => ({
	type: ActionType.SetIsObservingDecks,
	payload: value
})

export const updateDeck = (
	snapshot: firebase.firestore.DocumentSnapshot,
	userDataSnapshot: firebase.firestore.DocumentSnapshot
) => ({
	type: ActionType.UpdateDeck,
	payload: { snapshot, userDataSnapshot }
})

export const updateDeckUserData = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateDeckUserData,
	payload: snapshot
})

export const removeDeck = (id: string) => ({
	type: ActionType.RemoveDeck,
	payload: id
})

// Sections

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
