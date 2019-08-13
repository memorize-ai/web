import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { getDate } from './Helpers'
import Slug from './Slug'
import Deck from './Deck'
import Algolia from './Algolia'
import Email from './Email'
import Permission, { PermissionRole } from './Permission'
import Reputation, { ReputationAction } from './Reputation'
import Notification, { NotificationType } from './Notification'

const firestore = admin.firestore()
const storage = admin.storage().bucket()
const auth = admin.auth()

export default class User {
	static updateLastActivity(uid: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}`).update({ lastActivity: new Date })
	}

	static updateLastCardNotification(uid: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}`).update({ lastCardNotification: new Date })
	}

	static updateRoleForDeck(uid: string, deckId: string, role: PermissionRole): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/decks/${deckId}`)
		return doc.get().then(deck =>
			deck.exists
				? doc.update({ role: role === PermissionRole.none ? admin.firestore.FieldValue.delete() : Permission.stringify(role) })
				: Promise.resolve() as Promise<any>
		)
	}

	static addDeck(uid: string, deckId: string, role: PermissionRole): Promise<FirebaseFirestore.WriteResult> {
		const doc = firestore.doc(`users/${uid}/decks/${deckId}`)
		return doc.get().then(deck => {
			if (deck.exists)
				return doc.update({ hidden: false })
			const updateObject: any = { mastered: 0, hidden: false }
			if (role !== PermissionRole.none)
				updateObject.role = Permission.stringify(role)
			return doc.set(updateObject)
		})
	}

	static updateViews(id: string, { total, unique }: { total: number, unique: number }): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${id}`).update({
			'views.total': admin.firestore.FieldValue.increment(total),
			'views.unique': admin.firestore.FieldValue.increment(unique)
		})
	}

	static getLastCardNotificationDifference(snapshot: FirebaseFirestore.DocumentSnapshot, date: number = Date.now()): number {
		return date - (getDate(snapshot, 'lastCardNotification') || new Date(0)).getTime()
	}

	static getTokens(uid: string): Promise<string[]> {
		return firestore.collection(`users/${uid}/tokens`).get().then(tokens =>
			tokens.docs.filter(token => token.get('enabled')).map(token => token.id)
		)
	}
}

export type UserViews = { total: number, unique: number }

export const userCreated = functions.firestore.document('users/{uid}').onCreate((snapshot, context) => {
	const uid = context.params.uid
	const name: string | undefined = snapshot.get('name')
	const now = new Date
	return Promise.all([
		Algolia.create({ index: Algolia.indices.users, snapshot }),
		firestore.doc(`users/${uid}`).update({ joined: now, lastOnline: now, lastActivity: now }),
		name ? updateUser(uid, name) : Promise.resolve() as Promise<any>,
		Reputation.push(uid, ReputationAction.join, 'Joined memorize.ai', undefined, 0)
	])
})

export const userUpdated = functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const uid: string = context.params.uid
	const afterName: string | undefined = change.after.get('name')
	if (!afterName) return Promise.resolve()
	const beforeLastCardNotification: FirebaseFirestore.Timestamp | undefined = change.before.get('lastCardNotification')
	const afterLastCardNotification: FirebaseFirestore.Timestamp | undefined = change.after.get('lastCardNotification')
	return (beforeLastCardNotification && afterLastCardNotification ? beforeLastCardNotification.isEqual(afterLastCardNotification) : true) && (change.before.get('lastOnline') as FirebaseFirestore.Timestamp).isEqual(change.after.get('lastOnline') as FirebaseFirestore.Timestamp) && (change.before.get('lastActivity') as FirebaseFirestore.Timestamp).isEqual(change.after.get('lastActivity') as FirebaseFirestore.Timestamp)
		? Promise.all([
			Algolia.update({ index: Algolia.indices.users, change }),
			change.before.get('name') === afterName
				? Promise.resolve() as Promise<any>
				: updateUser(uid, afterName),
			sendReputationMilestoneNotification(uid, change.before.get('reputation'), change.after.get('reputation')),
			User.updateLastActivity(uid)
		])
		: Promise.resolve()
})

export const userDeleted = functions.auth.user().onDelete(user => {
	const id = user.uid
	const path = `users/${id}`
	return Promise.all([
		Algolia.delete({ index: Algolia.indices.users, id }),
		firestore.doc(path).delete(),
		storage.file(path).delete()
	])
})

export const updateLastOnline = functions.https.onCall((_data, context) =>
	context.auth ? firestore.doc(`users/${context.auth.uid}`).update({ lastOnline: new Date }) : Promise.resolve()
)

export const viewUser = functions.https.onCall((data, context) => {
	const otherUid: string | undefined = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	const viewerDoc = firestore.doc(`users/${otherUid}/viewers/${uid}`)
	return viewerDoc.get().then(viewer =>
		Promise.all([
			User.updateLastActivity(uid),
			viewer.exists
				? User.updateViews(otherUid, { total: 1, unique: 0 }) as Promise<any>
				: Promise.all([
					viewerDoc.set({ following: false }),
					User.updateViews(otherUid, { total: 1, unique: 1 })
				])
		])
	)
})

export const followUser = functions.https.onCall((data, context) => {
	const otherUid: string | undefined = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	if (uid === otherUid) return new functions.https.HttpsError('failed-precondition', 'You cannot follow yourself')
	const setObject = { current: true, dateFollowed: new Date }
	const setDoc = (path: string) =>
		firestore.doc(path).set(setObject)
	return Promise.all([
		setDoc(`users/${otherUid}/followers/${uid}`),
		setDoc(`users/${uid}/following/${otherUid}`),
		firestore.doc(`users/${otherUid}/viewers/${uid}`).set({ following: true })
	])
})

export const unfollowUser = functions.https.onCall((data, context) => {
	const otherUid: string | undefined = data.uid
	if (!(otherUid && context.auth)) return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid')
	const uid = context.auth.uid
	const updateObject = { current: false, dateUnfollowed: new Date }
	const updateDoc = (path: string) =>
		firestore.doc(path).update(updateObject)
	return Promise.all([
		updateDoc(`users/${otherUid}/followers/${uid}`),
		updateDoc(`users/${uid}/following/${otherUid}`),
		firestore.doc(`users/${otherUid}/viewers/${uid}`).set({ following: false })
	])
})

export const contactUser = functions.https.onCall((data, context) => {
	const otherUid: string | undefined = data.uid
	const subject: string | undefined = data.subject
	const body: string | undefined = data.body
	const shareLink: string | undefined = data.shareLink
	if (!(otherUid && subject && body && shareLink && context.auth))
		return new functions.https.HttpsError('unauthenticated', 'You need to be signed in and specify a uid, subject, body, and your shareLink')
	const uid = context.auth.uid
	return firestore.doc(`users/${uid}`).get().then(user =>
		Email.sendEmail(otherUid, subject, `${body}\n\nSent by <a href="${shareLink}">${user.get('name') || 'Unknown user'}</a> through <a href="https://memorize.ai">memorize.ai</a>`)
	)
})

export const followerCreated = functions.firestore.document('users/{uid}/followers/{followerId}').onCreate((_snapshot, context) => {
	const uid: string = context.params.uid
	const followerId: string = context.params.followerId
	return firestore.doc(`users/${uid}`).update({ followersCount: admin.firestore.FieldValue.increment(1) }).then(_writeResult =>
		firestore.doc(`users/${followerId}`).get().then(follower => {
			const followerName: string = follower.get('name') || 'Unknown user'
			return Reputation.push(uid, ReputationAction.everyFollower, `${followerName} followed you`, { uid: followerId }).then(__writeResult =>
				firestore.doc(`users/${uid}`).get().then(user => {
					const followers: number | undefined = user.get('followersCount')
					return followers === undefined
						? Promise.resolve() as Promise<any>
						: Promise.all([
							addReputationForFollowers(followers, action => Reputation.push(uid, action, `You hit ${followers} followers`)),
							sendFollowerNotification(uid, followers, true, followerId, followerName)
						])
				})
			)
		})
	)
})

export const followerUpdated = functions.firestore.document('users/{uid}/followers/{followerId}').onUpdate((change, context) => {
	const uid: string = context.params.uid
	const followerId: string = context.params.followerId
	const isFollowing: boolean = change.after.get('current') || false
	return change.before.get('current') === isFollowing
		? Promise.resolve()
		: firestore.doc(`users/${uid}`).update({ followersCount: admin.firestore.FieldValue.increment(isFollowing ? 1 : -1) }).then(_writeResult =>
			firestore.doc(`users/${followerId}`).get().then(follower => {
				const followerName: string = follower.get('name') || 'Unknown user'
				return Reputation.push(uid, isFollowing ? ReputationAction.everyFollower : ReputationAction.everyUnfollow, `${followerName} ${isFollowing ? '' : 'un'}followed you`, { uid: followerId }).then(__writeResult =>
					firestore.doc(`users/${uid}`).get().then(user => {
						const followers: number | undefined = user.get('followersCount')
						return followers === undefined
							? Promise.resolve() as Promise<any>
							: Promise.all([
								isFollowing ? addReputationForFollowers(followers, action => Reputation.push(uid, action, `You hit ${followers} followers`)) : Promise.resolve() as Promise<any>,
								sendFollowerNotification(uid, followers, isFollowing, followerId, followerName)
							])
					})
				)
			})
		)
})

export const followerDeleted = functions.firestore.document('users/{uid}/followers/{followerId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followersCount: admin.firestore.FieldValue.increment(-1) })
)

export const followingCreated = functions.firestore.document('users/{uid}/following/{followingId}').onCreate((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(1) })
)

export const followingUpdated = functions.firestore.document('users/{uid}/following/{followingId}').onUpdate((change, context) => {
	const isFollowing: boolean | undefined = change.after.get('current')
	return change.before.get('current') === isFollowing
		? Promise.resolve()
		: firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(isFollowing ? 1 : -1) })
})

export const followingDeleted = functions.firestore.document('users/{uid}/following/{followingId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.uid}`).update({ followingCount: admin.firestore.FieldValue.increment(-1) })
)

export const deckAdded = functions.firestore.document('users/{uid}/decks/{deckId}').onCreate((_snapshot, context) =>
	Deck.user(context.params.uid, context.params.deckId).then(user =>
		Promise.all([
			Deck.updateDownloads(context.params.deckId, { total: user ? user.past ? 0 : 1 : 0, current: 1 }),
			Deck.doc(context.params.deckId, `users/${context.params.uid}`).update({ past: true, current: true }),
			User.updateLastActivity(context.params.uid)
		])
	)
)

export const deckRemoved = functions.firestore.document('users/{uid}/decks/{deckId}').onDelete((_snapshot, context) =>
	Promise.all([
		Deck.updateDownloads(context.params.deckId, { total: 0, current: -1 }),
		Deck.doc(context.params.deckId, `users/${context.params.uid}`).update({ current: false }),
		User.updateLastActivity(context.params.uid)
	])
)

function updateUser(uid: string, name: string): Promise<any[]> {
	return Promise.all([
		updateDisplayName(uid, name),
		updateSlugForName(uid, name)
	])
}

function updateDisplayName(uid: string, displayName: string): Promise<admin.auth.UserRecord> {
	return auth.updateUser(uid, { displayName })
}

function updateSlugForName(uid: string, name: string): Promise<FirebaseFirestore.WriteResult> {
	return Slug.findAvailable(new Slug(name)).then(slug =>
		firestore.doc(`users/${uid}`).update({ slug: slug.toString() })
	)
}

function sendFollowerNotification(uid: string, followers: number, following: boolean, followerId: string, followerName: string): Promise<admin.messaging.BatchResponse | null> {
	return new Notification('', `${followerName} ${following ? 'is following' : 'unfollowed'} you`, `You have ${followers} follower${followers === 1 ? '' : 's'}`)
		.setType(following ? NotificationType.newFollower : NotificationType.unfollowed)
		.addData('uid', followerId)
		.sendToUser(uid)
}

function addReputationForFollowers(followers: number, fn: (action: ReputationAction) => Promise<FirebaseFirestore.WriteResult>): Promise<FirebaseFirestore.WriteResult | null> {
	switch (0) {
	case followers % 10:
		return fn(ReputationAction.every10Followers)
	case followers % 50:
		return fn(ReputationAction.every50Followers)
	case followers % 100:
		return fn(ReputationAction.every100Followers)
	default:
		return Promise.resolve(null)
	}
}

function sendReputationMilestoneNotification(uid: string, before: number | undefined, after: number | undefined): Promise<admin.messaging.BatchResponse | null> {
	if (before === undefined || after === undefined || after <= before) return Promise.resolve(null)
	const sendNotification = (milestone: number) =>
		new Notification('', `Woohoo! You hit ${milestone} reputation`, 'Congratulations')
			.setType(NotificationType.reputationMilestone)
			.addData('amount', milestone.toString())
			.sendToUser(uid)
	for (const milestone of [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000])
		if (before < milestone && after >= milestone)
			return sendNotification(milestone)
	return Promise.resolve(null)
}