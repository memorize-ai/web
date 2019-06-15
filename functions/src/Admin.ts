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

export const resetAdminKey = functions.https.onRequest((req, res) =>
	Admin.httpsCheckKey(req, res, () =>
		Admin.resetKey().then(newKey =>
			res.status(200).send(newKey)
		)
	)
)

export const cleanData = functions.https.onRequest((req, res) =>
	Admin.httpsCheckKey(req, res, () => {
		const now = new Date
		return Promise.all([
			firestore.collection('decks').listDocuments().then(decks =>
				Promise.all(decks.map(deck =>
					Promise.all([
						deck.update({
							subtitle: '',
							tags: [],
							views: {
								total: 0,
								unique: 0
							},
							downloads: {
								total: 0,
								current: 0
							},
							ratings: {
								average: 0,
								1: 0,
								2: 0,
								3: 0,
								4: 0,
								5: 0
							},
							created: now,
							updated: now
						}),
						deck.collection('cards').listDocuments().then(cards =>
							Promise.all(cards.map(card =>
								card.update({
									created: now,
									updated: now,
									likes: 0,
									dislikes: 0
								})
							))
						)
					])
				))
			),
			firestore.collection('users').listDocuments().then(users =>
				Promise.all(users.map(user =>
					Promise.all([
						user.update({
							lastNotification: 0,
							joined: now,
							lastOnline: now,
							lastActivity: now
						}),
						user.collection('decks').listDocuments().then(decks =>
							Promise.all(decks.map(deck =>
								deck.delete()
							))
						)
					])
				))
			)
		])
	})
)