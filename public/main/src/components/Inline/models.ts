import Card from '../../models/Card'
import PerformanceRating from '../../models/PerformanceRating'

export interface Prediction {
	[PerformanceRating.Easy]: Date
	[PerformanceRating.Struggled]: Date
	[PerformanceRating.Forgot]: Date
}

export interface Progress {
	xp: number
	streak: number
	rating: PerformanceRating
	next: Date | null
	didNewlyMaster: boolean
	emoji: string
	message: string
}

export interface Recap {
	start: Date
	xpGained: number
	reviewedCount: number
	masteredCount: number
	totalCount: number
}

export interface _Card {
	value: Card
	snapshot: firebase.firestore.DocumentSnapshot
	rating: PerformanceRating | null
	prediction: Prediction | null
	streak: number
	isNew: boolean
	isNewlyMastered: boolean | null
}
