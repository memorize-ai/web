import * as functions from 'firebase-functions'

import User from '..'

export default functions.firestore.document('users/{uid}').onDelete(snapshot =>
	Promise.all([
		new User(snapshot).removeAuth(),
		User.decrementCounter()
	])
)
