import * as functions from 'firebase-functions'

import User from '..'
import { cauterize } from '../../utils'

export default functions.firestore
	.document('users/{uid}')
	.onCreate(cauterize(snapshot =>
		new User(snapshot).onCreate()
	))
