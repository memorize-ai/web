import * as admin from 'firebase-admin'
import * as _ from 'lodash'

import { DEFAULT_STORAGE_BUCKET } from './constants'

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

export const storageUrl = (pathComponents: string[], token: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${DEFAULT_STORAGE_BUCKET}/o/${pathComponents.join('%2F')}?alt=media&token=${token}`
