import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

const config = functions.config()
const client = algoliasearch(config.algolia.app_id, config.algolia.api_key)
const index = client.initIndex('decks')

export default class Algolia {
	private static save(data: FirebaseFirestore.DocumentData, context: functions.EventContext): Promise<any> {
		data.objectID = context.params.deckId
		return index.saveObject(data)
	}

	static createDeck(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext): Promise<any> {
		return Algolia.save(snapshot.data()!, context)
	}
	
	static updateDeck(change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext): Promise<any> {
		return Algolia.save(change.after.data()!, context)
	}
	
	static deleteDeck(snapshot: FirebaseFirestore.DocumentSnapshot) {
		return index.deleteObject(snapshot.id)
	}
}