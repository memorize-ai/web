import firebase from 'firebase/app'

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

if (
	!(
		apiKey &&
		authDomain &&
		databaseURL &&
		projectId &&
		storageBucket &&
		messagingSenderId &&
		appId &&
		measurementId
	)
)
	throw new Error('Missing Firebase credentials')

if (!firebase.apps.length)
	firebase.initializeApp({
		apiKey,
		authDomain,
		databaseURL,
		projectId,
		storageBucket,
		messagingSenderId,
		appId,
		measurementId
	})

export default firebase
