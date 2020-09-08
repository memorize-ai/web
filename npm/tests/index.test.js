const { deckFromId } = require('..')

it('fetches decks', async () => {
	const deck = await deckFromId('479340263')
	
	console.log(deck)
	expect(typeof deck).toBe('object')
})
