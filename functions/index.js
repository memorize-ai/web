const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')
const algoliasearch = require('algoliasearch')
const env = functions.config()
const ALGOLIA_ID = env.algolia.app_id
const ALGOLIA_ADMIN_KEY = env.algolia.api_key
//const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key
const ALGOLIA_INDEX_NAME = 'decks'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

const addKeyVal = obj => key => val => {
	obj[key] = val
	return obj
}

const updateDeckInAngolia = (snapshot, context) =>
	index.saveObject(addKeyVal(snapshot.data())('objectID')(context.params.deckId))

const deleteDeckInAngolia = snapshot =>
	index.deleteObject(snapshot.id)

const addToDate = date => elapsed =>
	new Date(date.getTime() + elapsed)

exports.deckCreated = functions.firestore.document('decks/{deckId}').onCreate(updateDeckInAngolia)
exports.deckUpdated = functions.firestore.document('decks/{deckId}').onUpdate(updateDeckInAngolia)
exports.deckDeleted = functions.firestore.document('decks/{deckId}').onDelete(deleteDeckInAngolia)

exports.cardCreated = functions.firestore.document('decks/{deckId}/cards/{cardId}').onCreate((snapshot, context) => {
	// return admin.firestore().collection('decks').document(context.params.deckId).
})

exports.history = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	let card = admin.firestore().collection('users').document(context.params.uid).collection('decks').document(context.params.deckId).collection('cards').document(context.params.cardId)
	let history = card.collection('history').document(context.params.historyId)
	return Promise.all([
		history.elapsed.setValue(history.date - card.last.getTime()),
		history.next.setValue(addToDate(history.date, history.correct ? history.elapsed * 2 : 14400000)),
		card.last.setValue(history.date),
		card.next.setValue(history.next)
	])
})

exports.generateThumbnail = functions.storage.bucket('decks').object().onFinalize((object) => {
	const bucket = gcs.bucket(fileBucket)
	const tempFilePath = path.join(os.tmpdir(), fileName)
	const metadata = { contentType: contentType }
	return bucket.file(filePath).download({ destination: tempFilePath }).then(() => {
		return spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath])
	}).then(() => {
		const thumbFileName = `thumb_${fileName}`
		const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)
		return bucket.upload(tempFilePath, {
			destination: thumbFilePath,
			metadata: metadata
		})
	}).then(() => fs.unlinkSync(tempFilePath))
})

exports.userCreated = functions.firestore.document('users/{uid}').onCreate((snapshot, context) => {
	return Promise.all([
		admin.firestore().collection('emails').document(snapshot.email.replace('@', '%2e')).setData({ id: context.params.uid }),
		admin.firestore().collection('links').document(snapshot.link).setData({ id: context.params.uid })
	])
})