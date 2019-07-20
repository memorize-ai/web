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
					amount: 1,
					order: 0
				},
				{
					id: 'rate-deck',
					description: 'Rate a deck',
					amount: 1,
					order: 1
				},
				{
					id: 'rate-deck-with-review',
					description: 'Rate a deck with a review',
					amount: 3,
					order: 2
				},
				{
					id: 'every-follower',
					description: 'Every follower gained',
					amount: 5,
					order: 3
				},
				{
					id: 'every-10-followers',
					description: 'A bonus for every 10 followers gained',
					amount: 20,
					order: 4
				},
				{
					id: 'every-50-followers',
					description: 'A bonus for every 50 followers gained',
					amount: 40,
					order: 5
				},
				{
					id: 'every-100-followers',
					description: 'A bonus for every 100 followers gained',
					amount: 100,
					order: 6
				},
				{
					id: 'every-unfollow',
					description: 'When you are unfollowed',
					amount: -5,
					order: 7
				},
				{
					id: 'every-card-reviewed',
					description: 'Every card reviewed',
					amount: 1,
					order: 8
				},
				{
					id: 'every-10-cards-reviewed',
					description: 'Every 10 cards reviewed',
					amount: 5,
					order: 9
				},
				{
					id: 'every-50-cards-reviewed',
					description: 'Every 50 cards reviewed',
					amount: 20,
					order: 10
				},
				{
					id: 'every-100-cards-reviewed',
					description: 'Every 100 cards reviewed',
					amount: 40,
					order: 11
				},
				{
					id: 'did-get-card-like',
					description: 'A card you made was liked',
					amount: 2,
					order: 12
				},
				{
					id: 'did-get-card-dislike',
					description: 'A card you made was disliked',
					amount: -2,
					order: 13
				},
				{
					id: 'create-deck',
					description: 'Create a deck',
					amount: 2,
					order: 14
				},
				{
					id: 'did-get-1-star-deck-rating',
					description: 'A deck you made was rated 1 star',
					amount: -5,
					order: 15
				},
				{
					id: 'did-get-2-star-deck-rating',
					description: 'A deck you made was rated 2 stars',
					amount: -2,
					order: 16
				},
				{
					id: 'did-get-4-star-deck-rating',
					description: 'A deck you made was rated 4 stars',
					amount: 10,
					order: 17
				},
				{
					id: 'did-get-5-star-deck-rating',
					description: 'A deck you made was rated 5 stars',
					amount: 40,
					order: 18
				}
			]
			return Promise.all(reputationDocuments.map(reputationDocument =>
				firestore.doc(`reputation/${reputationDocument.id}`).set({
					description: reputationDocument.description,
					amount: reputationDocument.amount,
					order: reputationDocument.order
				})
			)).then(_writeResults =>
				res.status(200).send('Complete')
			)
		default:
			return res.status(400).send('Unknown action')
		}
	})
)