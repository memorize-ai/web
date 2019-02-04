const functions = require('firebase-functions')

const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key

const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate((snapshot, context) => {
    const deck = snapshot.data()
    deck.objectID = context.params.deckId
    const index = client.initIndex(ALGOLIA_INDEX_NAME)
    return index.saveObject(deck)
})