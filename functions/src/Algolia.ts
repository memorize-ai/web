import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

export default class Algolia {
	private static env = functions.config()
	private static client = algoliasearch(Algolia.env.algolia.app_id, Algolia.env.algolia.api_key)
	private static index = Algolia.client.initIndex('decks')

	private static save(data: FirebaseFirestore.DocumentData, context: functions.EventContext): Promise<any> {
		data.objectID = context.params.deckId
		return Algolia.index.saveObject(data)
	}

	static createDeck(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext): Promise<any> {
		return Algolia.save(snapshot.data()!, context)
	}
	
	static updateDeck(change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext): Promise<any> {
		return Algolia.save(change.after.data()!, context)
	}
	
	static deleteDeck(snapshot: FirebaseFirestore.DocumentSnapshot) {
		return Algolia.index.deleteObject(snapshot.id)
	}
}