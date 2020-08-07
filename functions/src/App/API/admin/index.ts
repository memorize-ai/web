import { Express } from 'express'

import handleTransferDeck from './transferDeck'

export default (app: Express) => {
	handleTransferDeck(app)
}
