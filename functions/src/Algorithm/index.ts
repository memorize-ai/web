import PerformanceRating from '../PerformanceRating'
import CardUserData from '../Card/CardUserData'

export default class Algorithm {
	static DEFAULT_E = 2.5
	static MINIMUM_E = 1.3
	static MASTERED_STREAK = 20
	
	static nextDueDate = (rating: PerformanceRating, userData: CardUserData, start: Date = new Date): Date => {
		return start // TODO: Change this
	}
	
	static nextDueDateForNewCard = (rating: PerformanceRating, start: Date = new Date): Date => {
		switch (rating) {
			case PerformanceRating.Forgot:
				return start
			case PerformanceRating.Struggled:
				return new Date(start.getTime() + 1000 * 60 * 60 * 4)
			case PerformanceRating.Easy:
				return new Date(start.getTime() + 1000 * 60 * 60 * 24)
		}
	}
	
	static isPerformanceRatingCorrect = (rating: PerformanceRating): boolean =>
		rating.valueOf() > 0
}
