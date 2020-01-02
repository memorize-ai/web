import PerformanceRating, { performanceRatingFromNumber } from '../PerformanceRating'

export default class History {
	date: Date
	next: Date
	rating: PerformanceRating
	elapsed: number
	viewTime: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.date = snapshot.get('date')?.toDate()
		this.next = snapshot.get('next')?.toDate()
		this.rating = performanceRatingFromNumber(snapshot.get('rating')) ?? PerformanceRating.Easy
		this.elapsed = snapshot.get('elapsed')
		this.viewTime = snapshot.get('viewTime')
	}
}
