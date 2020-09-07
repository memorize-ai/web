import * as admin from 'firebase-admin'
import { Express } from 'express'

import { API_PREFIX } from '../../constants'
import Card from '../../Card'

const PATH = `/${API_PREFIX}/card`

const firestore = admin.firestore()

export default (app: Express) => {
	app.get(PATH, async ({
		query: { deck_id: deckId, section_id: sectionId, card_id: cardId, limit } },
		res
	) => {
		try {
			if (typeof deckId !== 'string') {
				res.status(400).send('You must send a "deck_id" query parameter')
				return
			}
			
			if (typeof cardId === 'string') {
				try {
					res.json((await Card.fromId(cardId, deckId)).json)
				} catch {
					res.status(404).send('Card not found')
				}
				return
			}
			
			let query: FirebaseFirestore.Query = firestore.collection(`decks/${deckId}/cards`)
			
			if (typeof sectionId === 'string')
				query = query.where('section', '==', sectionId)
			
			if (typeof limit === 'string') {
				const realLimit = parseInt(limit, 10)
				
				if (isNaN(realLimit) || realLimit < 0) {
					res.status(400).send('Invalid "limit"')
					return
				}
				
				query = query.limit(realLimit)
			}
			
			res.json(
				(await query.get())
					.docs
					.map(snapshot => {
						try {
							return new Card(snapshot).json
						} catch {
							return null
						}
					})
					.filter(Boolean)
			)
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	})
}
