const { join } = require('path')
const admin = require('firebase-admin')

const PATH = join(
	__dirname,
	'..',
	'..',
	'protected',
	'firebase-admin.json'
)

admin.initializeApp({
	credential: admin.credential.cert(PATH),
	storageBucket: 'memorize-ai.appspot.com'
})

exports.admin = admin

exports.firestore = admin.firestore()
exports.storage = admin.storage().bucket()
