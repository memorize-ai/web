import * as functions from 'firebase-functions'

import User from '..'
import { cauterize } from '../../utils'

export default functions.firestore
	.document('users/{uid}')
	.onUpdate(cauterize(({ before, after }) =>
		before.get('name') === after.get('name')
			? null
			: new User(after).normalizeDisplayName()
	))
