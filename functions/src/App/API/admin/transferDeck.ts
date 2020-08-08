import * as admin from 'firebase-admin'
import { Express } from 'express'

import User from '../../../User'
import Deck from '../../../Deck'
import { API_PREFIX, ADMIN_KEY, SUPPORT_ID } from '../../../constants'

const PATH = `/${API_PREFIX}/admin/transfer-deck`
const URL_REGEX = /^(?:https?:\/\/)?memorize\.ai\/d\/(.+?)\/.+?$/i

const firestore = admin.firestore()

export default (app: Express) => {
	app.post(PATH, async (req, res) => {
		try {
			if (req.header('Authorization') !== `Bearer ${ADMIN_KEY}`) {
				res.status(401).send('Incorrect admin key')
				return
			}
			
			if (req.header('Content-Type') !== 'application/json') {
				res.status(400).send('Must have Content-Type application/json')
				return
			}
			
			const { body } = req
			
			if (typeof body !== 'object') {
				res.status(400).send('Invalid request body')
				return
			}
			
			const { email, url } = body
			
			if (!(typeof email === 'string' && typeof url === 'string')) {
				res.status(400).send('You must send an "email" and "url" as strings')
				return
			}
			
			const slugId = url.match(URL_REGEX)?.[1]
			
			if (!slugId) {
				res.status(400).send('Invalid deck URL')
				return
			}
			
			const [deck, user] = await Promise.all([
				Deck.fromSlugId(slugId).catch(() => {
					throw new Error('There are no decks with the specified URL')
				}),
				User.fromEmail(email).catch(() => {
					throw new Error('There are no users with the specified email')
				})
			])
			
			if (deck.creatorId !== SUPPORT_ID) {
				res.status(401).send('You can only transfer decks that were created by the official memorize.ai account')
				return
			}
			
			await firestore.doc(`decks/${deck.id}`).update({
				creator: user.id
			})
			
			res.send(`Successfully transferred "${deck.name}" to "${user.name}"`)
		} catch (error) {
			console.error(error)
			res.status(404).send(error.message)
		}
	})
}
