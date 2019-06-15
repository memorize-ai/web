import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as secure from 'securejs'

const firestore = admin.firestore()

export default class Admin {
	private static doc(path: string): FirebaseFirestore.DocumentReference {
		return firestore.doc(`admin/${path}`)
	}

	static checkKey(key: string): Promise<boolean> {
		return Admin.doc('key').get().then(realKey =>
			realKey.get('value') === key
		)
	}

	static resetKey(): Promise<string> {
		const value = secure.newId(100)
		return firestore.doc('key').set({ value }).then(() => value)
	}
}

export const resetAdminKey = functions.https.onRequest((req, res) => {
	const key = req.query.key
	return key
		? Admin.checkKey(key).then(isValid =>
			isValid
				? Admin.resetKey().then(res.status(200).send)
				: new functions.https.HttpsError('permission-denied', 'Invalid admin key') as any
		)
		: new functions.https.HttpsError('invalid-argument', 'You must specify the current admin key')
})