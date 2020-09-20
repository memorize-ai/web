import * as admin from 'firebase-admin'
import { flatMap } from 'lodash'

import Print from './models'
import Deck from '../../Deck'

interface SectionWithId {
	id: string
	data: Print.Section
}

const UNSECTIONED_ID = ''
const UNSECTIONED_NAME = 'unsectioned'

const firestore = admin.firestore()

const snapshotToSectionWithId = (snapshot: FirebaseFirestore.DocumentSnapshot): SectionWithId => {
	if (!snapshot.exists)
		throw new Error(`Unknown section with ID "${snapshot.id}"`)
	
	return {
		id: snapshot.id,
		data: {
			name: snapshot.get('name'),
			card_count: snapshot.get('cardCount')
		}
	}
}

const getSections = async (deck: Deck, sectionId: string | undefined): Promise<SectionWithId[]> => {
	const collection = firestore.collection(`decks/${deck.id}/sections`)
	const unsectioned = {
		id: UNSECTIONED_ID,
		data: {
			name: 'Unsectioned',
			card_count: deck.numberOfUnsectionedCards
		}
	}
	
	return sectionId === undefined
		? [
			unsectioned,
			...(await collection.get())
				.docs
				.sort((a, b) => a.get('index') - b.get('index'))
				.map(snapshotToSectionWithId)
		]
		: [
			sectionId === UNSECTIONED_NAME
				? unsectioned
				: snapshotToSectionWithId(await collection.doc(sectionId).get())
		]
}

const getCards = async (deck: Deck, sectionId: string | undefined) => {
	const collection = firestore.collection(`decks/${deck.id}/cards`)
	const snapshot = await (
		sectionId === undefined
			? collection
			: collection.where(
				'section',
				'==',
				sectionId === UNSECTIONED_NAME ? UNSECTIONED_ID : sectionId
			)
	).get()
	
	return snapshot.docs
}

export default async (slugId: string, sectionId?: string): Promise<Print.Context> => {
	const deck = await Deck.fromSlugId(slugId)
	const [sections, cards] = await Promise.all([
		getSections(deck, sectionId),
		getCards(deck, sectionId)
	])
	
	return {
		deck_name: deck.name,
		cards: flatMap(sections, section =>
			cards
				.filter(snapshot => snapshot.get('section') === section.id)
				.map((snapshot, sectionIndex) => ({
					section_index: sectionIndex + 1,
					section: section.data,
					front: snapshot.get('front'),
					back: snapshot.get('back')
				}))
		)
	}
}
