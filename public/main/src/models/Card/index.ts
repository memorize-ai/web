import stripHtml from 'string-strip-html'

import firebase from '../../firebase'
import User from '../User'
import Deck from '../Deck'
import Section from '../Section'
import UserData from './UserData'
import { handleError } from '../../utils'

import 'firebase/firestore'

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

export interface CardDraft {
	id: string
	front: string
	back: string
}

export interface CardDraftUpdateObject {
	front?: string
	back?: string
}

export interface CardData {
	sectionId: string
	front: string
	back: string
	numberOfViews: number
	numberOfReviews: number
	numberOfSkips: number
}

export default class Card implements CardData {
	static isObserving: Record<string, boolean> = {}
	static snapshotListeners: Record<string, () => void> = {}
	static observers: Record<string, boolean> = {}
	
	id: string
	sectionId: string
	front: string
	back: string
	numberOfViews: number
	numberOfReviews: number
	numberOfSkips: number
	
	userData: UserData | null
	
	constructor(id: string, data: CardData, userData: UserData | null) {
		this.id = id
		this.sectionId = data.sectionId
		this.front = data.front
		this.back = data.back
		this.numberOfViews = data.numberOfViews
		this.numberOfReviews = data.numberOfReviews
		this.numberOfSkips = data.numberOfSkips
		
		this.userData = userData
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot, userData: UserData | null) =>
		new Card(snapshot.id, {
			sectionId: snapshot.get('section') ?? '',
			front: snapshot.get('front'),
			back: snapshot.get('back'),
			numberOfViews: snapshot.get('viewCount') ?? 0,
			numberOfReviews: snapshot.get('reviewCount') ?? 0,
			numberOfSkips: snapshot.get('skipCount') ?? 0
		}, userData)
	
	static addSnapshotListener = (id: string, value: () => void) =>
		Card.snapshotListeners[id] = value
	
	static removeSnapshotListener = (id: string) => {
		Card.snapshotListeners[id]?.()
		delete Card.snapshotListeners[id]
	}
	
	static observe = (
		{ deckId, sectionId, uid, initializeCards, addCard, updateCard, updateCardUserData, removeCard }: {
			deckId: string
			sectionId: string
			uid: string
			initializeCards: (parentId: string) => void
			addCard: (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			updateCard: (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			updateCardUserData: (parentId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			removeCard: (parentId: string, cardId: string) => void
		}
	) =>
		firestore.collection(`decks/${deckId}/cards`).where('section', '==', sectionId).onSnapshot(
			snapshot => {
				initializeCards(sectionId)
				
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							addCard(sectionId, doc)
							
							Card.addSnapshotListener(
								doc.id,
								firestore.doc(`users/${uid}/decks/${deckId}/cards/${doc.id}`).onSnapshot(
									userDataSnapshot => updateCardUserData(sectionId, userDataSnapshot),
									handleError
								)
							)
							
							break
						case 'modified':
							updateCard(sectionId, doc)
							break
						case 'removed':
							Card.removeSnapshotListener(doc.id)
							removeCard(sectionId, doc.id)
							break
					}
			},
			handleError
		)
	
	static getAllForDeck = async (deckId: string) =>
		(await firestore.collection(`decks/${deckId}/cards`).get())
			.docs
			.map(snapshot => Card.fromSnapshot(snapshot, null))
	
	static create = async (
		{ deck, section, ...data }: {
			deck: Deck
			section: Section
			front: string
			back: string
		}
	) =>
		(await firestore
			.collection(`decks/${deck.id}/cards`)
			.add({
				...data,
				section: section.id,
				viewCount: 0,
				reviewCount: 0,
				skipCount: 0
			})
		).id
	
	static getSummary = (text: string) =>
		stripHtml(text)
	
	get isUnsectioned() {
		return this.sectionId === ''
	}
	
	get isDue() {
		const { userData } = this
		
		return Boolean(
			userData && (userData.isNew || userData.dueDate.getTime() <= Date.now())
		)
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		console.log(snapshot.get('front'))
		
		this.sectionId = snapshot.get('section') ?? ''
		this.front = snapshot.get('front')
		this.back = snapshot.get('back')
		this.numberOfViews = snapshot.get('viewCount') ?? 0
		this.numberOfReviews = snapshot.get('reviewCount') ?? 0
		this.numberOfSkips = snapshot.get('skipCount') ?? 0
		
		return this
	}
	
	updateUserDataFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		snapshot.exists
			? this.userData?.updateFromSnapshot(snapshot) ?? (
				this.userData = UserData.fromSnapshot(snapshot)
			)
			: this.userData = null
		
		return this
	}
	
	edit = (
		{ deck, section, front, back }: {
			deck: Deck
			section: Section | null
			front: string
			back: string
		}
	) => {
		const data: Record<string, any> = { front, back }
		
		if (section)
			data.section = section.id
		
		return firestore.doc(`decks/${deck.id}/cards/${this.id}`).update(data)
	}
	
	delete = (user: User, deck: Deck) => {
		const promises: Promise<any>[] = [
			firestore.doc(`decks/${deck.id}/cards/${this.id}`).delete()
		]
		
		if (this.isDue)
			promises.push(
				firestore.doc(`users/${user.id}/decks/${deck.id}`).update({
					dueCardCount: FieldValue.increment(-1),
					[this.isUnsectioned
						? 'unsectionedDueCardCount'
						: `sections.${this.sectionId}`
					]: FieldValue.increment(-1)
				})
			)
		
		return Promise.all(promises)
	}
}
