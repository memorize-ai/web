import PreviewDeck from 'models/PreviewDeck'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getPreviewDeck = async (): Promise<PreviewDeck> => {
	const doc = firestore.doc(`decks/${process.env.PREVIEW_DECK_ID}`)
	
	const [deck, { docs: _sections }, { docs: _cards }] =
		await Promise.all([
			doc.get(),
			doc.collection('sections').get(),
			doc.collection('cards').get()
		])
	
	if (!deck.exists)
		throw new Error('Preview deck does not exist')
	
	const sections = [
		{
			id: '',
			name: 'Unsectioned',
			index: -1,
			numberOfCards: deck.get('unsectionedCardCount')
		},
		..._sections
			.map(section => ({
				id: section.id,
				name: section.get('name'),
				index: section.get('index'),
				numberOfCards: section.get('cardCount')
			}))
			.sort(({ index: a }, { index: b }) => a - b)
	]
	
	const cards = _cards.map(card => ({
		id: card.id,
		sectionId: card.get('section'),
		front: card.get('front'),
		back: card.get('back')
	}))
	
	return {
		id: deck.id,
		slugId: deck.get('slugId'),
		name: deck.get('name'),
		sections: sections.reduce((acc, section) => ({
			...acc,
			[section.id]: section
		}), {}),
		cards: sections.reduce((acc, section) => [
			...acc,
			...cards.filter(card => card.sectionId === section.id)
		], [])
	}
}

export default getPreviewDeck
