import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

const config = functions.config().algolia
const client = algoliasearch(config.app_id, config.api_key)

export default class Algolia {
	static indices = {
		decks: client.initIndex('decks'),
		users: client.initIndex('users')
	}

	private static save({ index, data, id }: { index: algoliasearch.Index, data: FirebaseFirestore.DocumentData, id: string }): Promise<algoliasearch.Task> {
		data.objectID = id
		return index.saveObject(data)
	}

	static create({ index, snapshot }: { index: algoliasearch.Index, snapshot: FirebaseFirestore.DocumentSnapshot }): Promise<algoliasearch.Task> {
		return Algolia.save({ index, data: snapshot.data()!, id: snapshot.id })
	}
	
	static update({ index, change }: { index: algoliasearch.Index, change: functions.Change<FirebaseFirestore.DocumentSnapshot> }): Promise<algoliasearch.Task> {
		const after = change.after
		return Algolia.save({ index, data: after.data()!, id: after.id })
	}
	
	static delete({ index, id }: { index: algoliasearch.Index, id: string }): Promise<algoliasearch.Task> {
		return index.deleteObject(id)
	}
}