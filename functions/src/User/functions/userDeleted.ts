import * as functions from 'firebase-functions'

import User from '..'

export default functions.firestore.document('users/{uid}').onDelete(snapshot =>
	new User(snapshot).removeAuth()
)
