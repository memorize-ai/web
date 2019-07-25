import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { getQueryParameter } from './Helpers'

const firestore = admin.firestore()

export const addAnalytics = functions.https.onCall((data, _context) => {
	const category = getQueryParameter(data, 'category')
	const id = getQueryParameter(data, 'id', false)
	return category && category.length && id && id.length
		? firestore.doc(`analytics/${category}`).get().then(snapshot =>
			snapshot.exists
				? snapshot.ref.update({ [id]: snapshot.get(id) ? admin.firestore.FieldValue.increment(1) : 1 })
				: snapshot.ref.set({ [id]: 1 })
		)
		: new functions.https.HttpsError('invalid-argument', 'You must specify an action and url')
})