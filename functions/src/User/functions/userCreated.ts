import * as functions from 'firebase-functions'

import User from '..'

export default functions.firestore.document('users/{uid}').onCreate(snapshot =>
	new User(snapshot).normalizeDisplayName()
)
