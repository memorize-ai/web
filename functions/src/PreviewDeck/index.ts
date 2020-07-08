import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export const modifyCounter = (increment: number) =>
	firestore.doc('counters/previewDeckScores').update({
		value: admin.firestore.FieldValue.increment(increment)
	})
