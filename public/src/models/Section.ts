import firebase from '../firebase'
import Deck from './Deck'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default class Section {
	id: string
	name: string
	index: number
	numberOfCards: number
	
	constructor(snapshot: firebase.firestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.index = snapshot.get('index')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
	}
	
	static observeForDeckWithId = (
		deckId: string,
		{ addSection, updateSection, removeSection }: {
			addSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			removeSection: (deckId: string, sectionId: string) => void
		}
	) =>
		firestore.collection(`decks/${deckId}/sections`).onSnapshot(
			snapshot => {
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							addSection(deckId, doc)
							break
						case 'modified':
							updateSection(deckId, doc)
							break
						case 'removed':
							removeSection(deckId, doc.id)
							break
					}
			},
			error => {
				alert(error.message)
				console.error(error)
			}
		)
	
	static createForDeck = async (deck: Deck, name: string) =>
		(await firestore
			.collection(`decks/${deck.id}/sections`)
			.add({
				name,
				index: deck.sections.length,
				cardCount: 0
			})
		).id
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.index = snapshot.get('index')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
		
		return this
	}
}
