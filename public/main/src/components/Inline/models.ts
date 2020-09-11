import PerformanceRating from '../../models/PerformanceRating'

export interface Prediction {
	[PerformanceRating.Easy]: Date
	[PerformanceRating.Struggled]: Date
	[PerformanceRating.Forgot]: Date
}
