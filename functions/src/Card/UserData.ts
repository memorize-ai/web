import * as admin from 'firebase-admin'

import Section from '../Section'

const firestore = admin.firestore()

export default class CardUserData {
	isNew: boolean
	sectionId: string
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
		this.isNew = snapshot.get('new')
		this.sectionId = snapshot.get('section')
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
			id: last?.id,
			date: last.date?.toDate(),
			next: last.next?.toDate()
		}
	}
	
	static fromId = (uid: string, deckId: string, cardId: string) =>
		firestore.doc(`users/${uid}/decks/${deckId}/cards/${cardId}`).get().then(snapshot =>
			new CardUserData(snapshot)
		)
	
	get isDue() {
		return this.due.getTime() <= Date.now()
	}
	
	get isUnsectioned() {
		return this.sectionId === Section.unsectionedId
	}
}
