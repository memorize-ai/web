import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Algolia from './Algolia'

const firestore = admin.firestore()

export default class Upload {
	static bucket = 'gs://uploads.memorize.ai'
	static storage = admin.storage().bucket(Upload.bucket)

	static updateLastUpdated(uid: string, uploadId: string): Promise<FirebaseFirestore.WriteResult> {
		return firestore.doc(`users/${uid}/uploads/${uploadId}`).update({ updated: new Date })
	}
}

export const uploadCreated = functions.firestore.document('users/{uid}/uploads/{uploadId}').onCreate((snapshot, context) =>
	Promise.all([
		updateLastActivity(context),
		Algolia.create({ index: Algolia.indices.uploads, snapshot })
	])
)

export const uploadUpdated = functions.firestore.document('users/{uid}/uploads/{uploadId}').onUpdate((change, context) =>
	change.before.get('updated') === change.after.get('updated')
		? Promise.all([
			updateLastActivity(context),
			Algolia.update({ index: Algolia.indices.uploads, change }),
			Upload.updateLastUpdated(context.params.uid, context.params.uploadId)
		])
		: Promise.resolve()
)

export const uploadDeleted = functions.firestore.document('users/{uid}/uploads/{uploadId}').onDelete((_snapshot, context) =>
	Promise.all([
		updateLastActivity(context),
		Algolia.delete({ index: Algolia.indices.uploads, id: context.params.uploadId }),
		context.auth ? Upload.storage.file(`${context.auth.uid}/${context.params.uploadId}`).delete() : Promise.resolve()
	])
)

export const uploadStorageFinalized = functions.storage.bucket(Upload.bucket).object().onFinalize((_object, context) =>
	updateLastActivity(context)
)

function updateLastActivity(context: functions.EventContext): Promise<any> {
	return context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve()
}