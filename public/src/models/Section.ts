import firebase from '../firebase'
import Deck from './Deck'

import 'firebase/firestore'

const firestore = firebase.firestore()

export interface SectionData {
	name: string
	index: number
	numberOfCards: number
}

export default class Section implements SectionData {
	id: string
	name: string
	index: number
	numberOfCards: number
	
	constructor(id: string, data: SectionData) {
		this.id = id
		this.name = data.name
		this.index = data.index
		this.numberOfCards = data.numberOfCards
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new Section(snapshot.id, {
			name: snapshot.get('name'),
			index: snapshot.get('index'),
			numberOfCards: snapshot.get('cardCount') ?? 0
		})
	
	static newUnsectionedSection = (numberOfCards: number) =>
		new Section('', {
			name: 'Unsectioned',
			index: -1,
			numberOfCards
		})
	
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
	
	get isUnsectioned() {
		return !this.id
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.index = snapshot.get('index')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
		
		return this
	}
}
