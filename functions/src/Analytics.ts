import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export const addAnalytics = functions.https.onCall((data, _context) => {
	const category: string | undefined = data.category
	const id: string | undefined = data.id
	return category && category.length && id && id.length
		? firestore.doc(`analytics/${category}`).get().then(snapshot =>
			snapshot.ref.update({ [id]: snapshot.get(id) === undefined ? 1 : admin.firestore.FieldValue.increment(1) })
		)
		: new functions.https.HttpsError('invalid-argument', 'You must specify an action and url')
})