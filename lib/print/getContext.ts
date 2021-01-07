import flatMap from 'lodash/flatMap'

import { PrintError, Context, SectionWithId } from './models'
import Deck from 'models/Deck'
import firebase from 'lib/firebase/admin'

const UNSECTIONED_ID = ''
const UNSECTIONED_NAME = 'unsectioned'

const firestore = firebase.firestore()

const snapshotToSectionWithId = (
	snapshot: FirebaseFirestore.DocumentSnapshot
): SectionWithId => {
	if (!snapshot.exists) throw new PrintError(404, 'Section not found')

	return {
		id: snapshot.id,
		data: {
			name: snapshot.get('name'),
			card_count: snapshot.get('cardCount')
		}
	}
}

const getSections = async (deck: Deck, sectionId: string | undefined) => {
	const collection = firestore.collection(`decks/${deck.id}/sections`)
	const unsectioned: SectionWithId = {
		id: UNSECTIONED_ID,
		data: {
			name: 'Unsectioned',
			card_count: deck.numberOfUnsectionedCards
		}
	}

	return sectionId
		? [
				sectionId === UNSECTIONED_NAME
					? unsectioned
					: snapshotToSectionWithId(await collection.doc(sectionId).get())
		  ]
		: [
				unsectioned,
				...(await collection.get()).docs
					.sort((a, b) => a.get('index') - b.get('index'))
					.map(snapshotToSectionWithId)
		  ]
}

const getCards = async (deck: Deck, sectionId: string | undefined) => {
	const collection = firestore.collection(`decks/${deck.id}/cards`)
	const query = sectionId
		? collection.where(
				'section',
				'==',
				sectionId === UNSECTIONED_NAME ? UNSECTIONED_ID : sectionId
		  )
		: collection

	return (await query.get()).docs
}

const getContext = async (
	deck: Deck,
	sectionId: string | undefined
): Promise<Context> => {
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

export default getContext
