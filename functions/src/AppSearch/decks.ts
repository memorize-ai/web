import { config } from 'firebase-functions'
import * as Client from '@elastic/app-search-node'

export const ENGINE_NAME = 'memorize-ai-decks'
export const PRIVATE_KEY = config().app_search.decks_private_key

export const client = new Client('host-fig55q', PRIVATE_KEY)

const createIndices = (documents: Record<string, any>[]): Promise<void> =>
	client.indexDocuments(ENGINE_NAME, documents)

const deleteIndices = (ids: string[]): Promise<void> =>
	client.destroyDocuments(ENGINE_NAME, ids)

export default {
	createIndices,
	createIndex: (data: Record<string, any>) => createIndices([data]),
	deleteIndices,
	deleteIndex: (id: string) => deleteIndices([id])
}
