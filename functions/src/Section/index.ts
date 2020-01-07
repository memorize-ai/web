import * as admin from 'firebase-admin'

import DeckUserData from '../Deck/UserData'
import CardUserData from '../Card/UserData'

const firestore = admin.firestore()

export default class Section {
	id: string
	name: string
	numberOfCards: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
	}
	
	static fromId = (sectionId: string, deckId: string): Promise<Section> =>
		firestore.doc(`decks/${deckId}/sections/${sectionId}`).get().then(snapshot =>
			new Section(snapshot)
		)
	
	static numberOfDueCards = async (
		deckUserData: DeckUserData,
		cardUserData: CardUserData[],
		cache: Record<string, Section>
	): Promise<Record<string, number>> => {
		const deckId = deckUserData.id
		const acc: Record<string, number> = {}
		
		for (const sectionId in deckUserData.sections) {
			const section = cache[sectionId]
				?? await Section.fromId(sectionId, deckId)
			
			if (!cache[sectionId])
				cache[sectionId] = section
			
			acc[sectionId] = cardUserData.reduce((dueCount, { isDue }) =>
				dueCount - (isDue ? 0 : 1)
			, section.numberOfCards)
		}
		
		return acc
	}
	
	deleteCards = (deckId: string): Promise<FirebaseFirestore.WriteResult[]> =>
		firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', this.id)
			.get()
			.then(({ docs }) =>
				Promise.all(docs.map(({ ref }) =>
					ref.delete()
				))
			)
}
