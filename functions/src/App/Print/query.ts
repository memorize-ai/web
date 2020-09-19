import * as admin from 'firebase-admin'

import Deck from '../../Deck'
import { PrintableCard } from './generate'

const firestore = admin.firestore()

export default async (slugId: string, sectionId?: string) => {
	const { id } = await Deck.fromSlugId(slugId)
	
	const collection = firestore.collection(`decks/${id}/cards`)
	const { docs } = await (
		sectionId === undefined
			? collection
			: collection.where('section', '==', sectionId)
	).get()
	
	return docs.map(snapshot => ({
		front: snapshot.get('front'),
		back: snapshot.get('back')
	} as PrintableCard))
}
