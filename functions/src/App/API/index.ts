import { Express } from 'express'

import handleUploadDeckAsset from './uploadDeckAsset'
import handleUser from './user'
import handleDeck from './deck'

export default (app: Express) => {
	handleUploadDeckAsset(app)
	handleUser(app)
	handleDeck(app)
}
