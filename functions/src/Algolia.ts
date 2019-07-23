import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

const config: { app_id: string, api_key: string } = functions.config().algolia
const client = algoliasearch(config.app_id, config.api_key)

export default class Algolia {
	static indices = {
		decks: client.initIndex('decks'),
		users: client.initIndex('users'),
		uploads: client.initIndex('uploads')
	}

	private static save({ index, data, id, excess }: { index: algoliasearch.Index, data: FirebaseFirestore.DocumentData, id: string, excess?: any }): Promise<algoliasearch.Task> {
		data.objectID = id
		return index.saveObject(Object.assign(data, excess))
	}

	static create({ index, snapshot, excess }: { index: algoliasearch.Index, snapshot: FirebaseFirestore.DocumentSnapshot, excess?: any }): Promise<algoliasearch.Task> {
		const data = snapshot.data()
		return data
			? Algolia.save({ index, data, id: snapshot.id, excess })
			: Promise.reject()
	}
	
	static update({ index, change, excess }: { index: algoliasearch.Index, change: functions.Change<FirebaseFirestore.DocumentSnapshot>, excess?: any }): Promise<algoliasearch.Task> {
		return Algolia.create({ index, snapshot: change.after, excess })
	}
	
	static delete({ index, id }: { index: algoliasearch.Index, id: string }): Promise<algoliasearch.Task> {
		return index.deleteObject(id)
	}
}