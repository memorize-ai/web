import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class CardUserData {
	due: Date
	totalNumberOfRecallAttempts: number
	numberOfForgotRecallAttempts: number
	numberOfStruggledRecallAttempts: number
	numberOfEasyRecallAttempts: number
	streak: number
	e: number
	isMastered: boolean
	last: {
		id: string
		date: Date
		next: Date
	}
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.due = snapshot.get('due')?.toDate()
		this.totalNumberOfRecallAttempts = snapshot.get('totalCount')
		this.numberOfForgotRecallAttempts = snapshot.get('forgotCount') ?? 0
		this.numberOfStruggledRecallAttempts = snapshot.get('struggledCount') ?? 0
		this.numberOfEasyRecallAttempts = snapshot.get('easyCount') ?? 0
		this.streak = snapshot.get('streak')
		this.e = snapshot.get('e')
		this.isMastered = snapshot.get('mastered')
		
		const last = snapshot.get('last')
		
		this.last = {
			id: last.id,
			date: last.date.toDate(),
			next: last.next.toDate()
		}
	}
	
	static fromId = (uid: string, deckId: string, cardId: string): Promise<CardUserData | null> =>
		firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`).get().then(snapshot =>
			snapshot.exists
				? new CardUserData(snapshot)
				: null
		)
	
	get isDue(): boolean {
		return this.due.getTime() <= Date.now()
	}
}
