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
			return Admin.resetKey().then(newKey =>
				res.status(200).send(newKey)
			)
		case 'reset-last-notifications':
			const lastNotification = new Date(0)
			return firestore.collection('users').listDocuments().then(users =>
				Promise.all(users.map(user =>
					user.update({ lastNotification })
				))
			).then(_writeResults =>
				res.status(200).send('Complete')
			)
		case 'add-missing-fields-v2.4':
			const updateObject = {
				bio: '',
				reputation: 0,
				publicEmail: true,
				allowContact: true,
				followersCount: 0,
				followingCount: 0,
				views: {
					total: 0,
					unique: 0
				}
			}
			return firestore.collection('users').listDocuments().then(users =>
				Promise.all(users.map(user =>
					user.update(updateObject)
				))
			).then(_writeResults =>
				res.status(200).send('Complete')
			)
		case 'add-reputation-documents':
			const reputationDocuments = [
				{
					id: 'join',
					description: 'Join memorize.ai',
					amount: 1
				}
			]
			return Promise.all(reputationDocuments.map(reputationDocument =>
				firestore.doc(`reputation/${reputationDocument.id}`).set({
					description: reputationDocument.description,
					amount: reputationDocument.amount
				})
			)).then(_writeResults =>
				res.status(200).send('Complete')
			)
		default:
			return res.status(400).send('Unknown action')
		}
	})
)