import deckList from './cache/deckList'

const getDecks = (limit = 0) => deckList.get(limit)

export default getDecks
