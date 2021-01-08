import firebase from 'firebase-admin'

const key = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_KEY
const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

if (!key) throw new Error('Missing Firebase admin key')
if (!(databaseURL && storageBucket))
	throw new Error('Missing Firebase credentials')

if (!firebase.apps.length)
	firebase.initializeApp({
		credential: firebase.credential.cert(
			JSON.parse(Buffer.from(key, 'base64').toString())
		),
		databaseURL,
		storageBucket
	})

export default firebase
