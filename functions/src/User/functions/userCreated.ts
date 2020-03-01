import * as functions from 'firebase-functions'

import User from '..'

export default functions.firestore.document('users/{uid}').onCreate(snapshot =>
	Promise.all([
		new User(snapshot).normalizeDisplayName(),
		User.incrementCounter()
	])
)
