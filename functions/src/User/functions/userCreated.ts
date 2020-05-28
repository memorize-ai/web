import * as functions from 'firebase-functions'

import User from '..'
import { cauterize } from '../../utils'

export default functions.firestore
	.document('users/{uid}')
	.onCreate(cauterize(snapshot =>
		Promise.all([
			new User(snapshot).normalizeDisplayName(),
			User.resetUnsubscribed(snapshot.id),
			User.incrementCounter()
		])
	))
