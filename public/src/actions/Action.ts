export default interface Action<Payload> {
	type: ActionType
	payload: Payload
}

export enum ActionType {
	SetIsObservingDecks = 'SET_IS_OBSERVING_DECKS',
	UpdateDeck = 'UPDATE_DECK',
	UpdateDeckUserData = 'UPDATE_DECK_USER_DATA',
	RemoveDeck = 'REMOVE_DECK',
	
	SetIsObservingSections = 'SET_IS_OBSERVING_SECTIONS',
	AddSection = 'ADD_SECTION',
	UpdateSection = 'UPDATE_SECTION',
	RemoveSection = 'REMOVE_SECTION'
}
