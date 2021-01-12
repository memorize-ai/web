import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import LoadingState from 'models/LoadingState'
import { ReviewPrediction } from '../useReviewState'
import RateButton from '../RateButton'

import styles from './index.module.scss'

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
		subtitle: "You tried but couldn't remember"
	}
}

export interface ReviewFooterProps {
	isWaitingForRating: boolean
	prediction: ReviewPrediction | null
	predictionLoadingState: LoadingState
	rate(rating: PerformanceRating): void
}

const ReviewFooter = ({
	isWaitingForRating,
	prediction,
	predictionLoadingState,
	rate
}: ReviewFooterProps) => (
	<footer
		className={cx(styles.root, {
			[styles.waitingForRating]: isWaitingForRating
		})}
	>
		<p className={styles.message} tabIndex={-1}>
			Tap anywhere to continue
		</p>
		<div className={styles.buttons} tabIndex={-1}>
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
