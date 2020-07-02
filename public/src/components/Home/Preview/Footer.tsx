import React, { memo } from 'react'
import cx from 'classnames'

import PerformanceRating from '../../../models/PerformanceRating'
import { PreviewPredictions } from './usePreview'
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

const PreviewFooter = (
	{ isFinished, isWaitingForRating, predictions, rate }: {
		isFinished: boolean
		isWaitingForRating: boolean
		predictions: PreviewPredictions | null
		rate: (rating: PerformanceRating) => void
	}
) => (
	<div className={cx('footer', { 'waiting-for-rating': isWaitingForRating })}>
		<p
			className={cx('message', { hidden: isFinished })}
			tabIndex={-1}
		>
			Try to recall, then flip
		</p>
		<div className="buttons" tabIndex={-1}>
			{RATINGS.map(rating => (
				<RateButton
					{...BUTTON_CONTENT[rating]}
					key={rating}
					rate={rate}
					rating={rating}
					prediction={predictions && predictions[rating]}
				/>
			))}
		</div>
	</div>
)

export default memo(PreviewFooter)
