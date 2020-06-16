import * as admin from 'firebase-admin'

import Deck from '../../Deck'

const firestore = admin.firestore()

export const uidFromApiKey = async (apiKey: string) =>
	(await firestore.doc(`api-keys/${apiKey}`).get())
		.get('user') as string | undefined

export const getDeck = (deck: Deck, uid: string) =>
	deck.get(uid)
		.then(() => true)
		.catch(() => false)
