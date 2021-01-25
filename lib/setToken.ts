import firebase from './firebase'
import getToken, { TOKEN_PERMISSION_BLOCKED_CODE } from './getToken'
import handleError from './handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

const setToken = async (id: string) => {
	try {
		const token = await getToken()
		if (!token) return

		await firestore.doc(`users/${id}/tokens/${token}`).set({})
	} catch (error) {
		if (error.code === TOKEN_PERMISSION_BLOCKED_CODE) return
		handleError(error)
	}
}

export default setToken
