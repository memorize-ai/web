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
	static observers: Record<string, boolean> = {}
	
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
		{ initializeSections, addSection, updateSection, removeSection }: {
			initializeSections: (deckId: string) => void
			addSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			removeSection: (deckId: string, sectionId: string) => void
		}
	) =>
		firestore.collection(`decks/${deckId}/sections`).onSnapshot(
			snapshot => {
				initializeSections(deckId)
				
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
	
	static createForDeck = async (deck: Deck, name: string, numberOfSections: number) =>
		(await firestore
			.collection(`decks/${deck.id}/sections`)
			.add({
				name,
				index: numberOfSections,
				cardCount: 0
			})
		).id
	
	static sort = (sections: Section[]) =>
		sections.sort(({ index: a }, { index: b }) => a - b)
	
	get isUnsectioned() {
		return !this.id
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.index = snapshot.get('index')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
		
		return this
	}
	
	rename = (deck: Deck, name: string) =>
		firestore.doc(`decks/${deck.id}/sections/${this.id}`).update({ name })
	
	delete = (deck: Deck) =>
		firestore.doc(`decks/${deck.id}/sections/${this.id}`).delete()
}
