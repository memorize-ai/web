import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Tutorial {
	static all(): Promise<Tutorial[]>
}