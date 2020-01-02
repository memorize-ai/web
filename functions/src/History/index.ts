export default class History {
	date: Date
	next: Date
	rating: 0 | 1 | 2
	elapsed: number
	viewTime: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.date = snapshot.get('date')?.toDate()
		this.next = snapshot.get('next')?.toDate()
		this.rating = snapshot.get('rating')
		this.elapsed = snapshot.get('elapsed')
		this.viewTime = snapshot.get('viewTime')
	}
}
