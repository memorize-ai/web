import Action, { ActionType } from '../actions/Action'
import Deck from '../models/Deck'

export default (
	decks: Deck[] = [],
	{ type, payload }: Action<
		| firebase.firestore.DocumentSnapshot // UpdateDeck
		| string // RemoveDeck
		| { deckId: string, value: boolean } // SetIsObservingSections
		| { deckId: string, snapshot: firebase.firestore.DocumentSnapshot } // AddSection, UpdateSection
		| { deckId: string, sectionId: string } // RemoveSection
	>
) => {
	switch (type) {
		case ActionType.UpdateDeck: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot
			
			return decks.some(deck => deck.id === snapshot.id)
				? decks.map(deck =>
					deck.id === snapshot.id
						? deck.updateFromSnapshot(snapshot)
						: deck
				)
				: [...decks, Deck.fromSnapshot(snapshot)]
		}
		case ActionType.RemoveDeck:
			return decks.filter(deck => deck.id !== payload)
		case ActionType.SetIsObservingSections: {
			const { deckId, value } = payload as {
				deckId: string
				value: boolean
			}
			
			return decks.map(deck =>
				deck.id === deckId
					? deck.setIsObservingSections(value)
					: deck
			)
		}
		case ActionType.AddSection: {
			const { deckId, snapshot } = payload as {
				deckId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return decks.map(deck =>
				deck.id === deckId
					? deck.addSection(snapshot)
					: deck
			)
		}
		case ActionType.UpdateSection: {
			const { deckId, snapshot } = payload as {
				deckId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return decks.map(deck =>
				deck.id === deckId
					? deck.updateSection(snapshot)
					: deck
			)
		}
		case ActionType.RemoveSection: {
			const { deckId, sectionId } = payload as {
				deckId: string
				sectionId: string
			}
			
			return decks.map(deck =>
				deck.id === deckId
					? deck.removeSection(sectionId)
					: deck
			)
		}
		default:
			return decks
	}
}
