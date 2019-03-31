const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const algoliasearch = require('algoliasearch')
const env = functions.config()
const ALGOLIA_ID = env.algolia.app_id
const ALGOLIA_ADMIN_KEY = env.algolia.api_key
const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)
const db = admin.firestore()
const auth = admin.auth()

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
	findSlug(name.trim().replace(/ +/g, '_').toLowerCase())

exports.deleteUser = functions.auth.user().onDelete(user =>
	db.collection('users').doc(user.uid).delete()
)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate((snapshot, context) =>
	Promise.all([
		db.collection('users').doc(snapshot.creator).collection('decks').doc(context.params.deckId).set({ mastered: 0 }),
		updateDeckInAngolia(snapshot, context)
	])
)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(updateDeckInAngolia)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(deleteDeckInAngolia)

exports.cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_, context) =>
	db.collection('decks').doc(context.params.deckId).update({ count: FieldValue.increment(1) })
)

exports.permissionsCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_, context) =>
	db.collection('users').doc(context.params.permissionId).collection('decks').doc(context.params.deckId).set({ mastered: 0 })
)

exports.permissionsDeleted = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onDelete((_, context) =>
	db.collection('users').doc(context.params.permissionId).collection('decks').doc(context.params.deckId).delete()
)

exports.historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const cardRef = db.collection('users').doc(context.params.uid).collection('decks').doc(context.params.deckId).collection('cards').doc(context.params.cardId)
	return cardRef.get().then(card => {
		const cardData = card.data()
		const currentDate = new Date()
		const elapsed = currentDate - cardData.last.getTime()
		const nextDate = new Date(snapshot.date.getTime() + snapshot.correct ? elapsed * 2 : 14400000)
		return Promise.all([
			cardRef.collection('history').doc(context.params.historyId).update({
				date: currentDate,
				next: nextDate,
				elapsed: elapsed
			}),
			cardRef.update({
				count: FieldValue.increment(1),
				correct: FieldValue.increment(snapshot.correct ? 1 : 0),
				streak: snapshot.correct ? FieldValue.increment(1) : 0,
				mastered: snapshot.correct && cardData.streak >= 19,
				last: context.params.historyId,
				next: nextDate
			})
		])
	})
})

const updateDisplayName = uid => displayName =>
	displayName ? auth.updateUser(uid, { displayName }) : Promise.resolve()

const setupSlug = uid => user =>
	user.slug ? Promise.resolve() : newSlug(user.name).then(slug =>
		db.collection('users').doc(uid).update({ slug })
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