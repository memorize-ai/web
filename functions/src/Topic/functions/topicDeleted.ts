import functions from 'firebase-functions'
import admin from 'firebase-admin'

const storage = admin.storage().bucket()

export default functions.firestore.document('topics/{topicId}').onDelete((_snapshot, { params: { topicId } }) =>
	storage.file(`topics/${topicId}`).delete()
)
