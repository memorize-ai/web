import React from 'react'

import LoadingState from '../../models/LoadingState'
import PerformanceRating from '../../models/PerformanceRating'
import { Prediction } from './models'
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

export interface InlineRateButtonsProps {
	className?: string
	prediction: Prediction | null
	predictionLoadingState: LoadingState
	rate: (rating: PerformanceRating) => void
}

const InlineRateButtons = ({
	className,
	prediction,
	predictionLoadingState,
	rate
}: InlineRateButtonsProps) => (
	<div className={className} tabIndex={-1}>
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
)

export default InlineRateButtons
