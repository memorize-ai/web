import { config } from 'firebase-functions'
import * as AppSearchClient from '@elastic/app-search-node'

export default new AppSearchClient('host-fig55q', config().app_search.decks_private_key)

export const DECKS_ENGINE_NAME = 'memorize-ai-decks'
