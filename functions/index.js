const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
// const gcs = require('@google-cloud/storage')
// const spawn = require('child-process-promise').spawn
// const path = require('path')
// const os = require('os')
// const fs = require('fs')
const algoliasearch = require('algoliasearch')
const env = functions.config()
const ALGOLIA_ID = env.algolia.app_id
const ALGOLIA_ADMIN_KEY = env.algolia.api_key
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key
const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)
const db = admin.firestore()

const addKeyVal = obj => key => val => {
	obj[key] = val
	return obj
}

const id = x => x

const updateDeckInAngolia = (snapshot, context) =>
	index.saveObject(addKeyVal(snapshot.data())('objectID')(context.params.deckId))

const deleteDeckInAngolia = snapshot =>
	index.deleteObject(snapshot.id)

const assembleNextSlug = slug => slugParts =>
	slugParts
		? `${slugParts[1]}_${parseInt(slugParts[2]) + 1}`
		: slug + '_1'

const nextSlug = slug =>
	assembleNextSlug(slug)(slug.match(/^(.*)_(\d+)$/))

const findSlug = slug =>
	db.collection('users')
		.where('slug', '==', slug)
		.get()
		.then(doc => doc.exists ? findSlug(nextSlug(slug)) : slug)

const newSlug = user =>
	findSlug(user.name.trim().replace(/ +/g, '_').toLowerCase())

const emailKey = email =>
	email.replace('@', '%2E')

// We want to create user nodes with displayNames, so will do that from client app
// exports.newUser = functions.auth.user().onCreate(user =>
// 	user.displayName
// 		? newSlug(user).then(slug =>
// 			db.collection('users').doc(user.uid).set({
// 				name: user.displayName,
// 				email: user.email,
// 				slug
// 			})
// 		) : db.collection('users').doc(user.uid).set({
// 				email: user.email
// 			})
// )

exports.deleteUser = functions.auth.user().onDelete(user =>
	db.collection('users').doc(user.uid).delete()
)

exports.userDeleted = functions.firestore.document('users/{uid}').onDelete((snapshot, _) =>
	Promise.all([
		snapshot.data().slug
			? db.collection('slugs').doc(snapshot.data().slug).delete()
			: null,
		db.collection('emails').doc(emailKey(snapshot.data().email)).delete()
	].filter(id))
)

const addToDate = date => elapsed =>
	new Date(date.getTime() + elapsed)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate(updateDeckInAngolia)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(updateDeckInAngolia)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(deleteDeckInAngolia)

exports.cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((_, context) =>
	db.collection('decks').doc(context.params.deckId).get().then(deck =>
		db.collection('decks').doc(context.params.deckId).update({ count: deck.data().count + 1 })
	)
)

exports.permissionsCreated = functions.firestore.document('decks/{deckId}/permissions/{permissionId}').onCreate((_, context) =>
	db.collection('users').doc(context.params.permissionId).collection('decks').doc(context.params.deckId).set({ mastered: 0 })
)

exports.historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) =>
	db.collection('users').doc(context.params.uid).collection('decks').doc(context.params.deckId).collection('cards').doc(context.params.cardId).get().then(card => {
		const elapsed = snapshot.date - card.data().last.getTime()
		const next = addToDate(snapshot.date)(snapshot.correct ? elapsed * 2 : 14400000)
		return Promise.all([
			db.collection('users').doc(context.params.uid).collection('decks').doc(context.params.deckId).collection('cards').doc(context.params.cardId).collection('history').doc(context.params.historyId).update({ elapsed: elapsed, next: next }),
			db.collection('users').doc(context.params.uid).collection('decks').doc(context.params.deckId).collection('cards').doc(context.params.cardId).update({ last: snapshot.date, next: next })
		])
	})
)

// exports.generateThumbnail = functions.storage.bucket('decks').object().onFinalize((object) => {
// 	const bucket = gcs.bucket(fileBucket)
// 	const tempFilePath = path.join(os.tmpdir(), fileName)
// 	const metadata = { contentType: contentType }
// 	return bucket.file(filePath).download({ destination: tempFilePath }).then(() => {
// 		return spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath])
// 	}).then(() => {
// 		const thumbFileName = `thumb_${fileName}`
// 		const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)
// 		return bucket.upload(tempFilePath, {
// 			destination: thumbFilePath,
// 			metadata: metadata
// 		})
// 	}).then(() => fs.unlinkSync(tempFilePath))
// })

exports.userCreated = functions.firestore.document('users/{uid}').onCreate((snapshot, context) =>
	newSlug(snapshot.data()).then(slug =>
		db.collection('users').doc(context.params.uid).update({ slug: slug })
	)
)