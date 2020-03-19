import firebase from './firebase'

import 'firebase/auth'

const auth = firebase.auth()

export const isLoggedIn = () =>
	auth.currentUser !== null || (
		Object.keys(localStorage).some(key =>
			key.startsWith('firebase:authUser:')
		)
	)
