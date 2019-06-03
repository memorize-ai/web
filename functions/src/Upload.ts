import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'
import Algolia from './Algolia'

export default class Upload {
	static bucket = 'uploads.memorize.ai'
	static storage = admin.storage().bucket(Upload.bucket)
}

export const uploadCreated = functions.firestore.document('users/{uid}/uploads/{uploadId}').onCreate((snapshot, context) =>
	Promise.all([
		updateLastActivity(undefined, context),
		Algolia.create({ index: Algolia.indices.uploads, snapshot })
	])
)

export const uploadUpdated = functions.firestore.document('users/{uid}/uploads/{uploadId}').onUpdate((change, context) =>
	Promise.all([
		updateLastActivity(undefined, context),
		Algolia.update({ index: Algolia.indices.uploads, change })
	])
)

export const uploadDeleted = functions.firestore.document('users/{uid}/uploads/{uploadId}').onDelete((_snapshot, context) =>
	Promise.all([
		updateLastActivity(undefined, context),
		Algolia.delete({ index: Algolia.indices.uploads, id: context.params.uploadId }),
		context.auth ? Upload.storage.file(`${context.auth.uid}/${context.params.uploadId}`).delete() : Promise.resolve()
	])
)

export const uploadStorageFinalized = functions.storage.bucket(Upload.bucket).object().onFinalize(updateLastActivity)

function updateLastActivity(_placeholder: any, context: functions.EventContext): Promise<any> {
	return context.auth ? User.updateLastActivity(context.auth.uid) : Promise.resolve()
}