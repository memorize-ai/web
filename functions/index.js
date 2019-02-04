const functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')
const env = functions.config()
const ALGOLIA_ID = env.algolia.app_id
const ALGOLIA_ADMIN_KEY = env.algolia.api_key
//const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key

const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

const addKeyVal = obj => key => val => {
	obj[key] = val
	return obj
}

const updateDeckInAngolia = (snapshot, context) =>
    index.saveObject(addKeyVal(snapshot.data())('objectID')(context.params.deckId))

const deleteDeckInAngolia = snapshot =>
    index.deleteObject(snapshot.id)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate(updateDeckInAngolia)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(updateDeckInAngolia)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(deleteDeckInAngolia)
