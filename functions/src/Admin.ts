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
		return Admin.doc('key').set({ value }).then(() => value)
	}

	static httpsCheckKey(req: functions.https.Request, res: functions.Response, success: () => void) {
		const key = req.query.key
		return key
			? Admin.checkKey(key).then(isValid =>
				isValid
					? success()
					: res.status(401).send('Invalid admin key')
			)
			: res.status(400).send('You must specify the current admin key')
	}
}

export const adminFunction = functions.https.onRequest((req, res) =>
	Admin.httpsCheckKey(req, res, () => {
		const action = req.query.action
		if (!action) return res.status(400).send('You must specify an action')
		switch (action) {
		case 'reset-key':
			return Admin.resetKey().then(res.status(200).send)
		case 'reset-last-notifications':
			const lastNotification = new Date(0)
			return firestore.collection('users').listDocuments().then(users =>
				Promise.all(users.map(user =>
					user.update({ lastNotification })
				))
			).then(_writeResults =>
				res.status(200).send('Complete')
			)
		default:
			return res.status(400).send('Unknown action')
		}
	})
)