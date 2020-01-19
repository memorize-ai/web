enum PerformanceRating {
	Easy,
	Struggled,
	Forgot
}

export default PerformanceRating

export type NumberPerformanceRating = 0 | 1 | 2

export const performanceRatingFromNumber = (number: number) => {
	switch (number) {
		case 0:
			return PerformanceRating.Easy
		case 1:
			return PerformanceRating.Struggled
		case 2:
			return PerformanceRating.Forgot
		default:
			return null
	}
}
