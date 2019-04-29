const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const FieldValue = admin.firestore.FieldValue
const algoliasearch = require('algoliasearch')
const env = functions.config()
const ALGOLIA_ID = env.algolia.app_id
const ALGOLIA_ADMIN_KEY = env.algolia.api_key
const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)
const db = admin.firestore()
const auth = admin.auth()

const log = message => obj => {
	console.log(message, obj)
	return obj
}

const addKeyVal = obj => key => val => {
	obj[key] = val
	return obj
}

const updateDeckInAngolia = (snapshot, context) =>
	index.saveObject(addKeyVal(snapshot.data())('objectID')(context.params.deckId))

const deleteDeckInAngolia = snapshot =>
	index.deleteObject(snapshot.id)

const assembleNextSlug = slug => slugParts =>
	slugParts ? `${slugParts[1]}_${parseInt(slugParts[2]) + 1}` : slug + '_1'

const nextSlug = slug =>
	assembleNextSlug(slug)(slug.match(/^(.*)_(\d+)$/))

const findSlug = slug =>
	db.collection('users').where('slug', '==', slug).get().then(doc => doc.exists ? findSlug(nextSlug(slug)) : slug)

const newSlug = name =>
	findSlug(name.trim().replace(/\s+/g, '_').toLowerCase())

exports.deleteUser = functions.auth.user().onDelete(user =>
	db.doc(`users/${user.uid}`).delete()
)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate(updateDeckInAngolia)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(updateDeckInAngolia)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(deleteDeckInAngolia)

exports.cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_, context) =>
	db.doc(`decks/${context.params.deckId}`).update({ count: FieldValue.increment(1) })
)

exports.permissionsCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_, context) =>
	db.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).set({ mastered: 0 })
)

exports.permissionsDeleted = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onDelete((_, context) =>
	db.doc(`users/${context.params.permissionId}/decks/${context.params.deckId}`).delete()
)

const updateDisplayName = uid => displayName =>
	displayName ? auth.updateUser(uid, { displayName }) : Promise.resolve()

const setupSlug = uid => user =>
	user.slug ? Promise.resolve() : newSlug(user.name).then(slug =>
		db.doc(`users/${uid}`).update({ slug })
	)

const setupUser = uid => user =>
	Promise.all([
		updateDisplayName(uid)(user.name),
		setupSlug(uid)(user)
	])

const uidAndData = f => (snapshot, context) =>
	f(context.params.uid)(snapshot.data())

const uidAndFieldUpdated = f => field => (change, context) =>
	change.after.data()[field] === change.before.data()[field] ? Promise.resolve() : f(context.params.uid)(change.after.data()[field])

exports.userCreated = functions.firestore.document('users/{uid}').onCreate(uidAndData(setupUser))
exports.userUpdated = functions.firestore.document('users/{uid}').onUpdate(uidAndFieldUpdated(updateDisplayName)('name'))

const intervalSm2 = e => streak =>
	streak > 2 ? Math.round(6 * e ** (streak - 1)) : streak === 2 ? 6 : streak

const updateESm2 = e => rating =>
	Math.max(1.3, e - 0.8 + 0.28 * rating - 0.02 * rating ** 2)

exports.historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const current = new Date()
	const now = Date.now()
	const cardRef = db.doc(`users/${context.params.uid}/decks/${context.params.deckId}/cards/${context.params.cardId}`)
	return cardRef.get().then(card => {
		const cardData = log('card data')(card.data())
		const rating = log('rating')(snapshot.data().rating)
		const correct = rating > 2
		const increment = correct ? 1 : 0
		if (!cardData) {
			const next = new Date(now + 14400000)
			return Promise.all([
				cardRef.collection('history').doc(context.params.historyId).update({
					date: current,
					next: next,
					elapsed: 0
				}),
				cardRef.set({
					count: 1,
					correct: increment,
					e: 2.5,
					streak: increment,
					mastered: false,
					last: context.params.historyId,
					next: next
				})
			])
		} else {
			return cardRef.collection('history').doc(cardData.last).get().then(history => {
				const e = updateESm2(log('original e')(cardData.e))(rating)
				const streak = correct ? log('old streak')(cardData.streak) + 1 : 0
				const next = log('next date')(new Date(now + intervalSm2(log('new e')(e))(streak)))
				return Promise.all([
					cardRef.collection('history').doc(context.params.historyId).update({
						date: current,
						next,
						elapsed: now - history.data().date._seconds
					}),
					cardRef.update({
						count: FieldValue.increment(1),
						correct: FieldValue.increment(increment),
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