import PerformanceRating from '../Card/PerformanceRating'
import CardUserData from '../Card/UserData'

export default class Algorithm {
	private static MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
	
	static DEFAULT_E = 2.5
	static MINIMUM_E = 1.3
	static MASTERED_STREAK = 10
	
	static nextDueDate = (
		rating: PerformanceRating,
		userData: CardUserData,
		start: Date = new Date
	) => ({
		e: Algorithm.e(rating, userData.e),
		next: new Date(
			start.getTime() +
			Algorithm.interval(rating, userData, start)
		)
	})
	
	private static q = (rating: PerformanceRating) => {
		switch (rating) {
			case PerformanceRating.Forgot:
				return 0
			case PerformanceRating.Struggled:
				return 3
			case PerformanceRating.Easy:
				return 5
		}
	}
	
	private static e = (rating: PerformanceRating, e: number) => {
		const q = Algorithm.q(rating)
		
		return Math.max(
			Algorithm.MINIMUM_E,
			-0.02 * q ** 2 + 0.28 * q + e - 0.8
		)
	}
	
	private static interval = (
		rating: PerformanceRating,
		{ e, last }: CardUserData,
		date: Date
	) =>
		rating === PerformanceRating.Forgot
			? Algorithm.MILLISECONDS_IN_DAY
			: (date.getTime() - last.date.getTime()) * e
	
	static nextDueDateForNewCard = (start: Date = new Date) => ({
		e: Algorithm.DEFAULT_E,
		next: new Date(start.getTime() + Algorithm.MILLISECONDS_IN_DAY)
	})
	
	static isPerformanceRatingCorrect = (rating: PerformanceRating) =>
		rating.valueOf() > 0
}
