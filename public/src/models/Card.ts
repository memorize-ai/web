import firebase from '../firebase'
import Deck from './Deck'
import Section from './Section'

import 'firebase/firestore'

const firestore = firebase.firestore()

export interface CardData {
	sectionId: string | null
	front: string
	back: string
	numberOfViews: number
	numberOfReviews: number
	numberOfSkips: number
}

export default class Card implements CardData {
	id: string
	sectionId: string | null
	front: string
	back: string
	numberOfViews: number
	numberOfReviews: number
	numberOfSkips: number
	
	constructor(id: string, data: CardData) {
		this.id = id
		this.sectionId = data.sectionId
		this.front = data.front
		this.back = data.back
		this.numberOfViews = data.numberOfViews
		this.numberOfReviews = data.numberOfReviews
		this.numberOfSkips = data.numberOfSkips
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new Card(snapshot.id, {
			sectionId: snapshot.get('section') || null,
			front: snapshot.get('front'),
			back: snapshot.get('back'),
			numberOfViews: snapshot.get('viewCount') ?? 0,
			numberOfReviews: snapshot.get('reviewCount') ?? 0,
			numberOfSkips: snapshot.get('skipCount') ?? 0
		})
	
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
}
