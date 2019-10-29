import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const auth = admin.auth()

export default functions.firestore.document('users/{uid}').onCreate((snapshot, { params: { uid } }) =>
	auth.updateUser(uid, { displayName: snapshot.get('name') })
)
