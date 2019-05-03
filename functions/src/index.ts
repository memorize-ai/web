import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as algoliasearch from 'algoliasearch'
admin.initializeApp()

const env = functions.config()
const client = algoliasearch(env.algolia.app_id, env.algolia.api_key)
const index = client.initIndex('decks')
const auth = admin.auth()
const firestore = admin.firestore()
const messaging = admin.messaging()

class Algolia {
	static createDeck(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext): Promise<any> {
		const data = snapshot.data()!
		data['objectID'] = context.params.deckId
		return index.saveObject(data)
	}
	
	static updateDeck(change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext): Promise<any> {
		const data = change.after.data()!
		data['objectID'] = context.params.deckId
		return index.saveObject(data)
	}
	
	static deleteDeck(snapshot: FirebaseFirestore.DocumentSnapshot) {
		return index.deleteObject(snapshot.id)
	}
}

class Slug {
	static assemble(slug: string, slugParts: RegExpMatchArray) {
		return slugParts ? `${slugParts[1]}_${parseInt(slugParts[2]) + 1}` : `${slug}_1`
	}
	
	static next(slug: string): string {
		return Slug.assemble(slug, slug.match(/^(.*)_(\d+)$/)!)
	}
	
	static find(slug: string): Promise<any> {
		return firestore.collection('users').where('slug', '==', slug).get().then(snapshot => snapshot.docs[0].exists ? Slug.find(Slug.next(slug)) : slug)
	}
}

exports.userCreated = functions.firestore.document('users/{uid}').onCreate((change, context) => {
	const uid = context.params.uid
	const data = change.data()!
	return Promise.all([
		updateDisplayName(uid, data.name),
		data.slug ? Promise.resolve() : Slug.find(data.name.trim().replace(/\s+/g, '_').toLowerCase()).then(slug =>
			firestore.doc(`users/${uid}`).update({ slug, lastNotification: 0 })
		)
	])
})

exports.userUpdated = functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const afterName = change.after.data()!.name
	return afterName === change.before.data()!.name ? Promise.resolve() : updateDisplayName(context.params.uid, afterName)
})

exports.deleteUser = functions.auth.user().onDelete(user =>
	firestore.doc(`users/${user.uid}`).delete()
)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate(Algolia.createDeck)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(Algolia.updateDeck)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(Algolia.deleteDeck)

exports.cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_snapshot, context) =>
	firestore.doc(`decks/${context.params.deckId}`).update({ count: FirebaseFirestore.FieldValue.increment(1) })
)

exports.permissionsCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_snapshot, context) =>
	firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).set({ mastered: 0 })
)

exports.permissionsDeleted = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onDelete((_snapshot, context) =>
	firestore.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).delete()
)

function updateDisplayName(uid: string, displayName: string): Promise<any> {
	return displayName ? auth.updateUser(uid, { displayName }) : Promise.resolve()
}

class SM2 {
	static interval(e: number, streak: number): number {
		return streak > 2 ? Math.round(6 * e ** (streak - 2)) : streak === 2 ? 6 : streak
	}

	static e(e: number, rating: number): number {
		return Math.max(1.3, e - 0.8 + 0.28 * rating - 0.02 * rating ** 2)
	}
}

exports.historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const current = new Date()
	const now = Date.now()
	const cardRef = firestore.doc(`users/${context.params.uid}/decks/${context.params.deckId}/cards/${context.params.cardId}`)
	return cardRef.get().then(card => {
		const cardData = card.data()
		const rating = snapshot.data()!.rating
		const correct = rating > 2
		const increment = correct ? 1 : 0
		if (!cardData) {
			const next = new Date(now + 86400000)
			return Promise.all([
				cardRef.collection('history').doc(context.params.historyId).update({
					date: current,
					next,
					elapsed: 0
				}),
				cardRef.set({
					count: 1,
					correct: increment,
					e: 2.5,
					streak: increment,
					mastered: false,
					last: context.params.historyId,
					next
				})
			])
		} else {
			return cardRef.collection('history').doc(cardData.last).get().then(history => {
				const e = SM2.e(cardData.e, rating)
				const streak = correct ? cardData.streak + 1 : 0
				const next = new Date(now + SM2.interval(e, streak) * 86400000)
				return Promise.all([
					cardRef.collection('history').doc(context.params.historyId).update({
						date: current,
						next,
						elapsed: now - history.data()!.date.seconds
					}),
					cardRef.update({
						count: FirebaseFirestore.FieldValue.increment(1),
						correct: FirebaseFirestore.FieldValue.increment(increment),
						e,
						streak,
						mastered: rating === 5 && streak >= 20,
						last: context.params.historyId,
						next
					})
				])
			})
		}
	})
})

exports.checkCards = functions.pubsub.schedule('every 1 minutes').onRun(_context =>
	firestore.collection('users').get().then(users =>
		users.forEach(user =>
			Date.now() - user.data().lastNotification < 86400000
				? Promise.resolve()
				: firestore.collection(`users/${user.id}/decks`).get().then(decks =>
					decks.forEach(deck =>
						firestore.collection(`users/${user.id}/decks/${deck.id}/cards`).get().then(cards =>
							Promise.all(cards.docs.filter(card => Date.now() <= card.data().next.toMillis()).length
								? [
									firestore.doc(`users/${user.id}`).update({ lastNotification: Date.now() }),
									sendCardNotification(user.id)
								]
								: [
									Promise.resolve()
								]
							)
						)
					)
				)
		)
	)
)

function sendCardNotification(uid: string): Promise<any> {
	return firestore.collection(`users/${uid}/tokens`).get().then(tokens =>
		messaging.sendToDevice(tokens.docs.filter(element => element.data().enabled).map(element => element.id), {
			notification: {
				title: 'Review time!',
				body: 'You have new cards to review',
				icon: 'https://memorize.ai/images/logo.png'
			}
		})
	)
}