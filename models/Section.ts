import chunk from 'lodash/chunk'

import User from './User'
import Deck from './Deck'
import { CardDraft } from './Card'
import SnapshotLike from './SnapshotLike'
import firebase from 'lib/firebase'
import { FIRESTORE_BATCH_LIMIT } from 'lib/constants'

import 'firebase/firestore'

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

export interface SectionData {
	id: string
	name: string
	index: number
	cards: number
}

export default class Section {
	static readonly observers = new Set<string>()

	id: string
	name: string
	index: number
	numberOfCards: number

	constructor(data: SectionData) {
		this.id = data.id
		this.name = data.name
		this.index = data.index
		this.numberOfCards = data.cards
	}

	static fromSnapshot = (snapshot: SnapshotLike) =>
		new Section(Section.dataFromSnapshot(snapshot))

	static dataFromSnapshot = (snapshot: SnapshotLike): SectionData => ({
		id: snapshot.id,
		name: snapshot.get('name') ?? '(error)',
		index: snapshot.get('index') ?? 0,
		cards: snapshot.get('cardCount') ?? 0
	})

	static newUnsectionedSection = (numberOfCards: number) =>
		new Section({
			id: '',
			name: 'Unsectioned',
			index: -1,
			cards: numberOfCards
		})

	static createForDeck = async (
		deck: Deck,
		name: string,
		numberOfSections: number
	) =>
		(
			await firestore.collection(`decks/${deck.id}/sections`).add({
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

	publishCards = (user: User, deck: Deck, cards: CardDraft[]) => {
		const chunks = chunk(cards, FIRESTORE_BATCH_LIMIT)

		const promises = chunks.map(chunk => {
			const batch = firestore.batch()

			for (const { front, back } of chunk)
				batch.set(firestore.collection(`decks/${deck.id}/cards`).doc(), {
					section: this.id,
					front,
					back,
					viewCount: 0,
					reviewCount: 0,
					skipCount: 0
				})

			return batch.commit()
		})

		if (deck.isSectionUnlocked(this))
			promises.push(
				firestore.doc(`users/${user.id}/decks/${deck.id}`).update({
					dueCardCount: FieldValue.increment(1),
					[this.isUnsectioned
						? 'unsectionedDueCardCount'
						: `sections.${this.id}`]: FieldValue.increment(1)
				})
			)

		return Promise.all(promises)
	}
}
