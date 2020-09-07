import { Express } from 'express'

import handleUploadDeckAsset from './uploadDeckAsset'
import handleUser from './user'
import handleDeck from './deck'
import handleSection from './section'
import handleCard from './card'
import handleTopic from './topic'
import handleAdmin from './admin'

export default (app: Express) => {
	handleUploadDeckAsset(app)
	handleUser(app)
	handleDeck(app)
	handleSection(app)
	handleCard(app)
	handleTopic(app)
	handleAdmin(app)
}
