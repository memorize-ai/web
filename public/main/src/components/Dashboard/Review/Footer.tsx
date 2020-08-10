import React from 'react'
import cx from 'classnames'

import PerformanceRating from '../../../models/PerformanceRating'
import LoadingState from '../../../models/LoadingState'
import { ReviewPrediction } from './useReviewState'
import RateButton from './RateButton'

const RATINGS = [
	PerformanceRating.Easy,
	PerformanceRating.Struggled,
	PerformanceRating.Forgot
]

const BUTTON_CONTENT = {
	[PerformanceRating.Easy]: {
		emoji: '😀',
		title: 'Easy',
		subtitle: 'Without much effort, you were able to remember'
	},
	[PerformanceRating.Struggled]: {
		emoji: '😕',
		title: 'Struggled',
		subtitle: 'You struggled to remember, but eventually succeeded'
	},
	[PerformanceRating.Forgot]: {
		emoji: '😓',
		title: 'Forgot',
		subtitle: 'You tried but couldn\'t remember'
	}
}

const ReviewFooter = (
	{ isWaitingForRating, prediction, predictionLoadingState, rate }: {
		isWaitingForRating: boolean
		prediction: ReviewPrediction | null
		predictionLoadingState: LoadingState
		rate: (rating: PerformanceRating) => void
	}
) => (
	<footer className={cx({ 'waiting-for-rating': isWaitingForRating })}>
		<p className="message" tabIndex={-1}>
			Tap anywhere to continue
		</p>
		<div className="buttons" tabIndex={-1}>
			{RATINGS.map(rating => (
				<RateButton
					{...BUTTON_CONTENT[rating]}
					key={rating}
					rate={rate}
					rating={rating}
					prediction={
						predictionLoadingState === LoadingState.Success
							? prediction && prediction[rating]
							: null
					}
				/>
			))}
		</div>
	</footer>
)

export default ReviewFooter
