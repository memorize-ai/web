import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Slug from './Slug'

const firestore = admin.firestore()
const auth = admin.auth()

function updateDisplayName(uid: string, displayName: string): Promise<any> {
	return displayName ? auth.updateUser(uid, { displayName }) : Promise.resolve()
}

const userCreated = functions.firestore.document('users/{uid}').onCreate((change, context) => {
	const uid = context.params.uid
	const data = change.data()!
	return Promise.all([
		updateDisplayName(uid, data.name),
		data.slug ? Promise.resolve() : Slug.find(data.name).then(slug =>
			firestore.doc(`users/${uid}`).update({ slug, lastNotification: 0 })
		)
	])
})

const userUpdated = functions.firestore.document('users/{uid}').onUpdate((change, context) => {
	const afterName = change.after.data()!.name
	return afterName === change.before.data()!.name ? Promise.resolve() : updateDisplayName(context.params.uid, afterName)
})

const userDeleted = functions.auth.user().onDelete(user =>
	firestore.doc(`users/${user.uid}`).delete()
)

export { userCreated, userUpdated, userDeleted }