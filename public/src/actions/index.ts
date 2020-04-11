import { ActionType } from './Action'
import firebase from '../firebase'
import Deck from '../models/Deck'
import Card from '../models/Card'
import LoadingState from '../models/LoadingState'
import { Counter } from '../models/Counters'
import { SearchActionPayload } from '../contexts/Search'

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

export const updateOwnedDeck = (
	snapshot: firebase.firestore.DocumentSnapshot,
	userDataSnapshot: firebase.firestore.DocumentSnapshot
) => ({
	type: ActionType.UpdateOwnedDeck,
	payload: { snapshot, userDataSnapshot }
})

export const updateDeck = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateDeck,
	payload: snapshot
})

export const updateDeckUserData = (snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateDeckUserData,
	payload: snapshot
})

export const removeDeck = (id: string) => ({
	type: ActionType.RemoveDeck,
	payload: id
})

export const removeOwnedDeck = (id: string) => ({
	type: ActionType.RemoveOwnedDeck,
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

// Similar decks

export const initializeSimilarDecks = (deckId: string) => ({
	type: ActionType.InitializeSimilarDecks,
	payload: deckId
})

export const setSimilarDecks = (deckId: string, decks: Deck[]) => ({
	type: ActionType.SetSimilarDecks,
	payload: { deckId, decks }
})

// Sections

export const initializeSections = (deckId: string) => ({
	type: ActionType.InitializeSections,
	payload: deckId
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

export const initializeCards = (parentId: string) => ({
	type: ActionType.InitializeCards,
	payload: parentId
})

export const setCards = (parentId: string, cards: Card[]) => ({
	type: ActionType.SetCards,
	payload: { parentId, cards }
})

export const addCard = (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.AddCard,
	payload: { parentId, snapshot }
})

export const updateCard = (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateCard,
	payload: { parentId, snapshot }
})

export const updateCardUserData = (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => ({
	type: ActionType.UpdateCardUserData,
	payload: { parentId, snapshot }
})

export const removeCard = (parentId: string, cardId: string) => ({
	type: ActionType.RemoveCard,
	payload: { parentId, cardId }
})

// Topics

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

export const setCreateDeckTopics = (value: string[]) => ({
	type: ActionType.SetCreateDeckTopics,
	payload: value
})

// Expanded sections

export const toggleSectionExpanded = (deckId: string, sectionId: string, isOwned: boolean) => ({
	type: ActionType.ToggleSectionExpanded,
	payload: { deckId, sectionId, isOwned }
})

// Counters

export const setCounterKey = (key: Counter, value: number | null) => ({
	type: ActionType.SetCounterKey,
	payload: { key, value }
})

// Search

export const setSearchState = (state: SearchActionPayload) => ({
	type: ActionType.SetSearchState,
	payload: state
})
