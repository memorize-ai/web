const Memorize = require('..').default

it('fetches decks', async () => {
	const memorize = new Memorize()
	const deck = await memorize.deckFromId('479340263')
	
	console.log(deck)
	
	expect(typeof deck).toBe('object')
})
