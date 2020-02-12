import { config } from 'firebase-functions'
import * as AppSearchClient from '@elastic/app-search-node'

export default new AppSearchClient('host-fig55q', config().app_search.decks_private_key) as {
	indexDocuments: (engine: string, documents: Record<string, any>[]) => Promise<void>
	destroyDocuments: (engine: string, documents: string[]) => Promise<void>
}

export const DECKS_ENGINE_NAME = 'memorize-ai-decks'
