import { ActionType } from './Action'
import firebase from '../firebase'
import Deck from '../models/Deck'
import LoadingState from '../models/LoadingState'
import { Counter } from '../models/Counters'

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

export const setSelectedDeck = (deck: Deck) => ({
	type: ActionType.SetSelectedDeck,
	payload: deck
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

// Deck image URL

export const setDeckImageUrl = (deckId: string, url: string | null) => ({
	type: ActionType.SetDeckImageUrl,
	payload: { deckId, url }
})

export const setDeckImageUrlLoadingState = (deckId: string, loadingState: LoadingState) => ({
	type: ActionType.SetDeckImageUrlLoadingState,
	payload: { deckId, loadingState }
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

// Cards

export const initializeCards = (sectionId: string) => ({
	type: ActionType.InitializeCards,
	payload: sectionId
})

export const addCard = (sectionId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.AddCard,
	payload: { sectionId, snapshot }
})

export const updateCard = (sectionId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateCard,
	payload: { sectionId, snapshot }
})

export const updateCardUserData = (sectionId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateCardUserData,
	payload: { sectionId, snapshot }
})

export const removeCard = (sectionId: string, cardId: string) => ({
	type: ActionType.RemoveCard,
	payload: { sectionId, cardId }
})

// Topics

export const setIsObservingTopics = (value: boolean) => ({
	type: ActionType.SetIsObservingTopics,
	payload: value
})

export const addTopic = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.AddTopic,
	payload: snapshot
})

export const updateTopic = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateTopic,
	payload: snapshot
})

export const removeTopic = (id: string) => ({
	type: ActionType.RemoveTopic,
	payload: id
})

// Create deck

export const setCreateDeckImage = (value: File | null) => ({
	type: ActionType.SetCreateDeckImage,
	payload: value
})

export const setCreateDeckName = (value: string) => ({
	type: ActionType.SetCreateDeckName,
	payload: value
})

export const setCreateDeckSubtitle = (value: string) => ({
	type: ActionType.SetCreateDeckSubtitle,
	payload: value
})

export const setCreateDeckDescription = (value: string) => ({
	type: ActionType.SetCreateDeckDescription,
	payload: value
})

// Expanded sections

export const toggleSectionExpanded = (deckId: string, sectionId: string) => ({
	type: ActionType.ToggleSectionExpanded,
	payload: { deckId, sectionId }
})

// Counters

export const setCounterKey = (key: Counter, value: number | null) => ({
	type: ActionType.SetCounterKey,
	payload: { key, value }
})