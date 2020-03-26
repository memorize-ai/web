export interface CardUserDataConstructor {
	isNew: boolean
	sectionId: string
	dueDate: Date
	streak: number
	isMastered: boolean
}

export default class CardUserData implements CardUserDataConstructor {
	isNew: boolean
	sectionId: string
	dueDate: Date
	streak: number
	isMastered: boolean
	
	constructor(data: CardUserDataConstructor) {
		this.isNew = data.isNew
		this.sectionId = data.sectionId
		this.dueDate = data.dueDate
		this.streak = data.streak
		this.isMastered = data.isMastered
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new CardUserData({
			isNew: snapshot.get('new') ?? true,
			sectionId: snapshot.get('section') ?? '',
			dueDate: snapshot.get('due')?.toDate() ?? new Date(),
			streak: snapshot.get('streak') ?? 0,
			isMastered: snapshot.get('mastered') ?? false
		})
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.isNew = snapshot.get('new') ?? true
		this.sectionId = snapshot.get('section') ?? ''
		this.dueDate = snapshot.get('due')?.toDate() ?? new Date()
		this.streak = snapshot.get('streak') ?? 0
		this.isMastered = snapshot.get('mastered') ?? false
		
		return this
	}
}
