export default interface Action<Payload> {
	type: ActionType
	payload: Payload
}

export enum ActionType {
	SetCurrentUser = 'SET_CURRENT_USER',
	UpdateCurrentUser = 'UPDATE_CURRENT_USER',
	SetCurrentUserLoadingState = 'SET_CURRENT_USER_LOADING_STATE',
	SetIsObservingCurrentUser = 'SET_IS_OBSERVING_CURRENT_USER',
	
	SetIsObservingDecks = 'SET_IS_OBSERVING_DECKS',
	UpdateDeck = 'UPDATE_DECK',
	UpdateDeckUserData = 'UPDATE_DECK_USER_DATA',
	RemoveDeck = 'REMOVE_DECK',
	
	SetIsObservingSections = 'SET_IS_OBSERVING_SECTIONS',
	AddSection = 'ADD_SECTION',
	UpdateSection = 'UPDATE_SECTION',
	RemoveSection = 'REMOVE_SECTION'
}
