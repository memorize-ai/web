import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import { PreviewPredictions } from './usePreview'
import RateButton from './RateButton'
import ClaimXPButton from './ClaimXPButton'

const RATINGS = [
	PerformanceRating.Easy,
	PerformanceRating.Struggled,
	PerformanceRating.Forgot
]

const BUTTON_CONTENT = {
	[PerformanceRating.Easy]: {
		emoji: '😀',
		title: 'Easy',
		subtitle: 'Without much effort, you were able to remember',
		tooltipPosition: 'up-left'
	},
	[PerformanceRating.Struggled]: {
		emoji: '😕',
		title: 'Struggled',
		subtitle: 'You struggled to remember, but eventually succeeded',
		tooltipPosition: 'up'
	},
	[PerformanceRating.Forgot]: {
		emoji: '😓',
		title: 'Forgot',
		subtitle: 'You tried but couldn\'t remember',
		tooltipPosition: 'up-right'
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
	<div className={cx('footer', {
		finished: isFinished,
		'waiting-for-rating': isWaitingForRating
	})}>
		<ClaimXPButton inverted />
		<p className="message" tabIndex={-1}>
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

export default PreviewFooter
