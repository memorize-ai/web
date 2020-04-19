const { join } = require('path')
const admin = require('firebase-admin')

admin.initializeApp({
	credential: admin.credential.cert(join(__dirname, '../protected/firebase-admin.json')),
	storageBucket: 'memorize-ai.appspot.com'
})

exports.admin = admin

exports.firestore = admin.firestore()
exports.storage = admin.storage().bucket()
