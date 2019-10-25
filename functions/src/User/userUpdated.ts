import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const auth = admin.auth()

export default functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const newName = change.after.get('name')
	return change.before.get('name') !== newName && context.auth
		? updateDisplayName(context.auth.uid, newName)
		: null
})

const updateDisplayName = (uid: string, displayName: string): Promise<admin.auth.UserRecord> =>
	auth.updateUser(uid, { displayName })
