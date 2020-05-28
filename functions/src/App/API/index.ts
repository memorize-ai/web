import { Express } from 'express'

import handleUploadDeckAsset from './uploadDeckAsset'
import handleUser from './user'
import handleDeck from './deck'
import handleTopic from './topic'

export default (app: Express) => {
	handleUploadDeckAsset(app)
	handleUser(app)
	handleDeck(app)
	handleTopic(app)
}
