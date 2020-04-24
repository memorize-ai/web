export default interface Action<Payload> {
	type: ActionType
	payload: Payload
}

export interface OptionalAction<Payload> {
	type: ActionType
	payload?: Payload
}

export enum ActionType {
	SetCurrentUser,
	UpdateCurrentUser,
	SetCurrentUserLoadingState,
	SetIsObservingCurrentUser,
	
	SetSelectedDeck,
	UpdateDeck,
	UpdateOwnedDeck,
	UpdateDeckUserData,
	RemoveDeck,
	RemoveOwnedDeck,
	
	SetDeckImageUrl,
	SetDeckImageUrlLoadingState,
	
	InitializeSimilarDecks,
	SetSimilarDecks,
	
	InitializeSections,
	AddSection,
	UpdateSection,
	RemoveSection,
	
	InitializeCards,
	SetCards,
	SetCard,
	AddCard,
	UpdateCard,
	UpdateCardUserData,
	RemoveCard,
	
	AddTopic,
	UpdateTopic,
	RemoveTopic,
	
	SetCreateDeckImage,
	SetCreateDeckName,
	SetCreateDeckSubtitle,
	SetCreateDeckDescription,
	SetCreateDeckTopics,
	
	ToggleSectionExpanded,
	
	SetCounterKey,
	
	SetSearchState,
	
	SetAuthModalIsShowing,
	SetAuthModalCallback,
	
	UpdateCreator,
	RemoveCreator,
	
	AddCardsSet,
	AddCardsAdd,
	AddCardsUpdate,
	AddCardsRemove,
	AddCardsRemoveAll
}
