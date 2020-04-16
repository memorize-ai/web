import functions from 'firebase-functions'

import User from '..'

export default functions.firestore.document('users/{uid}').onUpdate(({ before, after }) =>
	before.get('name') === after.get('name')
		? null
		: new User(after).normalizeDisplayName()
)
