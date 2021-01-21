import PreviewDeck, { PreviewCard, PreviewSection } from 'models/PreviewDeck'
import firebase from './firebase/admin'

const deckId = process.env.NEXT_PUBLIC_PREVIEW_DECK_ID
if (!deckId) throw new Error('Missing preview deck ID')

const firestore = firebase.firestore()
let previewDeck: PreviewDeck | null = null

const getPreviewDeck = async (): Promise<PreviewDeck> => {
	if (previewDeck) return previewDeck

	const doc = firestore.doc(`decks/${deckId}`)

	const [deck, { docs: _sections }, { docs: _cards }] = await Promise.all([
		doc.get(),
		doc.collection('sections').get(),
		doc.collection('cards').get()
	])

	if (!deck.exists) throw new Error('Preview deck does not exist')

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

	return (previewDeck = {
		id: deck.id,
		slugId: deck.get('slugId'),
		name: deck.get('name'),
		sections: sections.reduce(
			(acc: Record<string, PreviewSection>, section) => {
				acc[section.id] = section
				return acc
			},
			{}
		),
		cards: sections.reduce((acc: PreviewCard[], section) => {
			acc.push(...cards.filter(card => card.sectionId === section.id))
			return acc
		}, [])
	})
}

export default getPreviewDeck
