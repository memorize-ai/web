const Memorize = require('..').default

it('fetches decks', async () => {
	const memorize = new Memorize()
	const deck = await memorize.deckFromId('479340263')
	
	console.log(deck)
	
	expect(typeof deck).toBe('object')
})

// it('fails on get deck without API key', async () => {
// 	const memorize = new Memorize('73f9f95f-c1dc-4be6-a595-024db7f3ac34')
// 	const deck = await memorize.getDeckFromId('479340263')
	
// 	console.log(deck)
	
// 	expect(typeof deck).toBe('object')
// })
