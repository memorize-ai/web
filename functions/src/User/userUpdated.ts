import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const auth = admin.auth()

export default functions.firestore.document('users/{uid}').onUpdate((change, { params: { uid } }) => {
	const newName = change.after.get('name')
	return change.before.get('name') === newName
		? null
		: auth.updateUser(uid, { displayName: newName })
})
