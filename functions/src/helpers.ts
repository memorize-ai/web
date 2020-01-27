import * as admin from 'firebase-admin'
import * as _ from 'lodash'

const firestore = admin.firestore()

export const batchWithChunks = <T>(
	array: T[],
	chunkSize: number,
	each: (chunk: T[], batch: FirebaseFirestore.WriteBatch) => void
) =>
	Promise.all(_.chunk(array, chunkSize).map(chunk => {
		const batch = firestore.batch()
		
		each(chunk, batch)
		
		return batch.commit()
	}))
