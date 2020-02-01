import * as admin from 'firebase-admin'
import * as _ from 'lodash'

const firestore = admin.firestore()

export const batchWithChunks = async <T>(
	array: T[],
	chunkSize: number,
	each: (chunk: T[], batch: FirebaseFirestore.WriteBatch) => void
) => {
	for (const chunk of _.chunk(array, chunkSize)) {
		const batch = firestore.batch()
		
		each(chunk, batch)
		
		await batch.commit()
	}
}
