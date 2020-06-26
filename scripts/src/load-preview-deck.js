const { join } = require('path')
const { writeFile } = require('fs/promises')

const { firestore } = require('../utils/firebase-admin')

const DECK_ID = 'OS2C4B49vb1rR1i1ALUL'
const PATH = join(__dirname, '../../public/src/data/preview.json')

if (require.main === module)
	(async () => {
		const ref = firestore.doc(`decks/${DECK_ID}`)
		
		const [deck, { docs: _sections }, { docs: _cards }] =
			await Promise.all([
				ref.get(),
				ref.collection('sections').get(),
				ref.collection('cards').get()
			])
		
		if (!deck.exists)
			return console.error('Deck does not exist')
		
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
				.sort(({ index: a }, { index: b }) => a - b) // Ascending index
		]
		
		const cards = _cards.map(card => ({
			id: card.id,
			sectionId: card.get('section'),
			front: card.get('front'),
			back: card.get('back')
		}))
		
		await writeFile(PATH, JSON.stringify({
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
		}))
	})()
